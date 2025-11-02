#!/usr/bin/env node
import { writeFileSync } from 'fs';
import { join } from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO_OWNER = 'PR-CYBR';
const REPO_NAME = 'PR-CYBR-MAP';

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

async function fetchProjectsV2(): Promise<ProjectItem[] | null> {
  console.log('Attempting to fetch GitHub Projects v2...');
  
  // Note: Projects v2 requires GraphQL and special permissions
  // For now, we'll return null to fall back to issues
  console.log('Projects v2 API requires organization access - falling back to issues');
  return null;
}

async function fetchIssuesAsBoard(): Promise<ProjectItem[]> {
  console.log('Fetching issues as project board...');
  
  const issues = await fetchWithAuth(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=all&per_page=100`
  );
  
  const items: ProjectItem[] = issues.map((issue: any) => {
    // Determine status from labels
    let status = 'Todo';
    const labels = issue.labels?.map((l: any) => l.name) || [];
    
    if (labels.some((l: string) => l.includes('doing') || l.includes('progress'))) {
      status = 'In Progress';
    } else if (issue.state === 'closed') {
      status = 'Done';
    }
    
    return {
      id: issue.id.toString(),
      title: issue.title,
      status,
      labels,
      assignees: issue.assignees?.map((a: any) => a.login) || [],
      url: issue.html_url,
      createdAt: issue.created_at,
    };
  });
  
  console.log(`Fetched ${items.length} issues as board items`);
  return items;
}

async function main() {
  try {
    // Try Projects v2 first, fall back to issues
    let items = await fetchProjectsV2();
    let source: 'projects' | 'issues' = 'projects';
    
    if (!items) {
      items = await fetchIssuesAsBoard();
      source = 'issues';
    }
    
    const data: ProjectsData = {
      items,
      timestamp: new Date().toISOString(),
      source,
    };
    
    const outputPath = join(process.cwd(), 'public', 'data', 'projects.json');
    writeFileSync(outputPath, JSON.stringify(data, null, 2));
    
    console.log(`✅ Project board data (source: ${source}) written to ${outputPath}`);
  } catch (error) {
    console.error('❌ Error fetching project data:', error);
    
    // Write empty data so build doesn't fail
    const fallbackData: ProjectsData = {
      items: [],
      timestamp: new Date().toISOString(),
      source: 'issues',
    };
    
    const outputPath = join(process.cwd(), 'public', 'data', 'projects.json');
    writeFileSync(outputPath, JSON.stringify(fallbackData, null, 2));
    console.log('⚠️  Written fallback project data');
  }
}

main();
