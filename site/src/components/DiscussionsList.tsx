import { useEffect, useState } from 'react';

interface Discussion {
  id: string;
  title: string;
  url: string;
  category: string;
  author: string;
  createdAt: string;
  answerCount: number;
  commentCount: number;
}

interface DiscussionsData {
  discussions: Discussion[];
  timestamp: string;
}

export default function DiscussionsList() {
  const [data, setData] = useState<DiscussionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/PR-CYBR-MAP/data/discussions.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch discussions');
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
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton h-24 w-full" />
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
        <span>Failed to load discussions: {error || 'Unknown error'}</span>
      </div>
    );
  }

  // Get unique categories
  const categories = ['all', ...new Set(data.discussions.map((d) => d.category))];

  // Filter discussions
  const filteredDiscussions = data.discussions.filter((discussion) => {
    const matchesSearch =
      searchTerm === '' ||
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || discussion.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="form-control flex-1">
          <input
            type="text"
            placeholder="Search discussions..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="select select-bordered"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="stats stats-vertical md:stats-horizontal shadow w-full bg-base-200">
        <div className="stat">
          <div className="stat-title">Total Discussions</div>
          <div className="stat-value text-primary">{data.discussions.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Filtered Results</div>
          <div className="stat-value text-secondary">
            {filteredDiscussions.length}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Categories</div>
          <div className="stat-value text-accent">{categories.length - 1}</div>
        </div>
      </div>

      {/* Discussions List */}
      {filteredDiscussions.length === 0 ? (
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
          <span>No discussions found matching your criteria</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDiscussions.map((discussion) => (
            <a
              key={discussion.id}
              href={discussion.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card bg-base-200 hover:bg-base-300 shadow-xl transition-all hover:scale-[1.02]"
            >
              <div className="card-body">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="card-title text-lg">{discussion.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className="badge badge-primary">
                        {discussion.category}
                      </div>
                      <div className="badge badge-ghost">
                        by {discussion.author}
                      </div>
                      <div className="badge badge-ghost">
                        {new Date(discussion.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    {discussion.answerCount > 0 && (
                      <div className="flex items-center gap-1 text-success">
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Answered</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span>{discussion.commentCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="text-center text-sm text-base-content/70">
        Last updated: {new Date(data.timestamp).toLocaleString()}
      </div>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body text-center">
          <h3 className="card-title justify-center">Start a Discussion</h3>
          <p className="text-base-content/70">
            Have a question or idea? Start a new discussion on GitHub
          </p>
          <div className="card-actions justify-center">
            <a
              href="https://github.com/PR-CYBR/PR-CYBR-MAP/discussions/new"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              New Discussion
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
