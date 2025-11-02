import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface RepoStats {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  languages: Record<string, number>;
  commitActivity: Array<{ week: number; total: number }>;
  timestamp: string;
}

export default function StatisticsCharts() {
  const [stats, setStats] = useState<RepoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/PR-CYBR-MAP/data/stats.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-64 w-full" />
        ))}
      </div>
    );
  }

  if (error || !stats) {
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
        <span>Failed to load statistics: {error || 'Unknown error'}</span>
      </div>
    );
  }

  // Prepare languages data
  const totalBytes = Object.values(stats.languages).reduce((a, b) => a + b, 0);
  const languageLabels = Object.keys(stats.languages);
  const languagePercentages = Object.values(stats.languages).map(
    (bytes) => ((bytes / totalBytes) * 100).toFixed(1)
  );

  const languagesChartData = {
    labels: languageLabels,
    datasets: [
      {
        data: languagePercentages,
        backgroundColor: [
          '#570df8',
          '#f000b8',
          '#37cdbe',
          '#fbbd23',
          '#f87272',
          '#3abff8',
          '#36d399',
        ],
        borderWidth: 2,
        borderColor: '#1d232a',
      },
    ],
  };

  // Prepare commit activity data (last 12 weeks)
  const commitLabels = stats.commitActivity
    .slice(-12)
    .map((_, i) => `Week ${i + 1}`);
  const commitData = stats.commitActivity.slice(-12).map((week) => week.total);

  const commitChartData = {
    labels: commitLabels,
    datasets: [
      {
        label: 'Commits',
        data: commitData,
        borderColor: '#570df8',
        backgroundColor: 'rgba(87, 13, 248, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#a6adbb',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#a6adbb',
        },
        grid: {
          color: 'rgba(166, 173, 187, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#a6adbb',
        },
        grid: {
          color: 'rgba(166, 173, 187, 0.1)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#a6adbb',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-primary">
            <svg
              className="h-8 w-8"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div className="stat-title">Stars</div>
          <div className="stat-value text-primary">{stats.stars}</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-secondary">
            <svg
              className="h-8 w-8"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
              <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <div className="stat-title">Forks</div>
          <div className="stat-value text-secondary">{stats.forks}</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-accent">
            <svg
              className="h-8 w-8"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="stat-title">Watchers</div>
          <div className="stat-value text-accent">{stats.watchers}</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-warning">
            <svg
              className="h-8 w-8"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="stat-title">Open Issues</div>
          <div className="stat-value text-warning">{stats.openIssues}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Languages</h2>
            <div className="h-64">
              <Doughnut data={languagesChartData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Commit Activity (12 weeks)</h2>
            <div className="h-64">
              <Line data={commitChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-base-content/70">
        Last updated: {new Date(stats.timestamp).toLocaleString()}
      </div>
    </div>
  );
}
