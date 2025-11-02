import { useEffect, useState } from 'react';

interface ProjectItem {
  id: string;
  title: string;
  status: string;
  labels: string[];
  assignees: string[];
  url: string;
  createdAt: string;
}

interface ProjectsData {
  items: ProjectItem[];
  timestamp: string;
  source: 'projects' | 'issues';
}

export default function DevelopmentBoard() {
  const [data, setData] = useState<ProjectsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/PR-CYBR-MAP/data/projects.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch project data');
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-96 w-full" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="alert alert-error">
        <svg
          className="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Failed to load project board: {error || 'Unknown error'}</span>
      </div>
    );
  }

  // Group items by status
  const columns = {
    'Todo': data.items.filter((item) => item.status === 'Todo'),
    'In Progress': data.items.filter((item) => item.status === 'In Progress'),
    'Done': data.items.filter((item) => item.status === 'Done'),
  };

  return (
    <div className="space-y-6">
      <div className="alert alert-info">
        <svg
          className="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 className="font-bold">Data Source: {data.source === 'projects' ? 'GitHub Projects v2' : 'GitHub Issues'}</h3>
          <div className="text-xs">This is a read-only view. To make changes, visit GitHub.</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(columns).map(([status, items]) => (
          <div key={status} className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-between">
                <span>{status}</span>
                <div className="badge badge-primary">{items.length}</div>
              </h2>
              <div className="space-y-3 mt-4 max-h-[600px] overflow-y-auto">
                {items.length === 0 ? (
                  <div className="text-center text-base-content/50 py-8">
                    No items
                  </div>
                ) : (
                  items.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card bg-base-100 hover:bg-base-300 shadow transition-all hover:scale-[1.02]"
                    >
                      <div className="card-body p-4">
                        <h3 className="font-semibold text-sm line-clamp-2">
                          {item.title}
                        </h3>
                        {item.labels.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.labels.slice(0, 3).map((label, idx) => (
                              <div key={idx} className="badge badge-sm badge-outline">
                                {label}
                              </div>
                            ))}
                            {item.labels.length > 3 && (
                              <div className="badge badge-sm badge-ghost">
                                +{item.labels.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                        {item.assignees.length > 0 && (
                          <div className="text-xs text-base-content/70 mt-2">
                            👤 {item.assignees.join(', ')}
                          </div>
                        )}
                        <div className="text-xs text-base-content/50 mt-1">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-base-content/70">
        Last updated: {new Date(data.timestamp).toLocaleString()}
      </div>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body text-center">
          <h3 className="card-title justify-center">Manage on GitHub</h3>
          <p className="text-base-content/70">
            View the full project board and make changes on GitHub
          </p>
          <div className="card-actions justify-center gap-2">
            <a
              href="https://github.com/PR-CYBR/PR-CYBR-MAP/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              View Issues
            </a>
            <a
              href="https://github.com/PR-CYBR/PR-CYBR-MAP/projects"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              View Projects
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
