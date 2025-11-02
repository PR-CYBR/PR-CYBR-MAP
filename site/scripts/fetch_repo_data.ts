#!/usr/bin/env node
import { writeFileSync } from 'fs';
import { join } from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO_OWNER = 'PR-CYBR';
const REPO_NAME = 'PR-CYBR-MAP';

interface RepoStats {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  languages: Record<string, number>;
  commitActivity: Array<{ week: number; total: number; }>;
  timestamp: string;
}

async function fetchWithAuth(url: string) {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'PR-CYBR-MAP-Site',
  };
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }
  
  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

async function fetchRepoStats(): Promise<RepoStats> {
  console.log('Fetching repository statistics...');
  
  // Fetch repo info
  const repoData = await fetchWithAuth(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`
  );
  
  // Fetch languages
  const languagesData = await fetchWithAuth(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/languages`
  );
  
  // Fetch commit activity (last 12 weeks)
  let commitActivity = [];
  try {
    commitActivity = await fetchWithAuth(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/stats/commit_activity`
    );
  } catch (error) {
    console.warn('Could not fetch commit activity:', error);
    commitActivity = [];
  }
  
  const stats: RepoStats = {
    stars: repoData.stargazers_count || 0,
    forks: repoData.forks_count || 0,
    watchers: repoData.subscribers_count || 0,
    openIssues: repoData.open_issues_count || 0,
    languages: languagesData,
    commitActivity: Array.isArray(commitActivity) ? commitActivity : [],
    timestamp: new Date().toISOString(),
  };
  
  console.log('Stats fetched:', {
    stars: stats.stars,
    forks: stats.forks,
    languages: Object.keys(stats.languages).length,
  });
  
  return stats;
}

async function main() {
  try {
    const stats = await fetchRepoStats();
    
    const outputPath = join(process.cwd(), 'public', 'data', 'stats.json');
    writeFileSync(outputPath, JSON.stringify(stats, null, 2));
    
    console.log(`✅ Stats written to ${outputPath}`);
  } catch (error) {
    console.error('❌ Error fetching repo stats:', error);
    
    // Write empty/fallback data so build doesn't fail
    const fallbackStats: RepoStats = {
      stars: 0,
      forks: 0,
      watchers: 0,
      openIssues: 0,
      languages: { TypeScript: 1 },
      commitActivity: [],
      timestamp: new Date().toISOString(),
    };
    
    const outputPath = join(process.cwd(), 'public', 'data', 'stats.json');
    writeFileSync(outputPath, JSON.stringify(fallbackStats, null, 2));
    console.log('⚠️  Written fallback stats data');
  }
}

main();
