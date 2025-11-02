#!/usr/bin/env node
import { writeFileSync } from 'fs';
import { join } from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO_OWNER = 'PR-CYBR';
const REPO_NAME = 'PR-CYBR-MAP';

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

async function fetchDiscussions(): Promise<DiscussionsData> {
  console.log('Fetching discussions...');
  
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'PR-CYBR-MAP-Site',
  };
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }
  
  // GitHub GraphQL query for discussions
  const query = `
    query {
      repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
        discussions(first: 25, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            id
            title
            url
            category {
              name
            }
            author {
              login
            }
            createdAt
            answer {
              id
            }
            comments {
              totalCount
            }
          }
        }
      }
    }
  `;
  
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    if (!response.ok) {
      throw new Error(`GitHub GraphQL API error: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }
    
    const discussions: Discussion[] = result.data?.repository?.discussions?.nodes?.map((node: any) => ({
      id: node.id,
      title: node.title,
      url: node.url,
      category: node.category?.name || 'General',
      author: node.author?.login || 'Unknown',
      createdAt: node.createdAt,
      answerCount: node.answer ? 1 : 0,
      commentCount: node.comments?.totalCount || 0,
    })) || [];
    
    console.log(`Fetched ${discussions.length} discussions`);
    
    return {
      discussions,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.warn('Could not fetch discussions:', error);
    return {
      discussions: [],
      timestamp: new Date().toISOString(),
    };
  }
}

async function main() {
  try {
    const data = await fetchDiscussions();
    
    const outputPath = join(process.cwd(), 'public', 'data', 'discussions.json');
    writeFileSync(outputPath, JSON.stringify(data, null, 2));
    
    console.log(`✅ Discussions written to ${outputPath}`);
  } catch (error) {
    console.error('❌ Error fetching discussions:', error);
    
    // Write empty data so build doesn't fail
    const fallbackData: DiscussionsData = {
      discussions: [],
      timestamp: new Date().toISOString(),
    };
    
    const outputPath = join(process.cwd(), 'public', 'data', 'discussions.json');
    writeFileSync(outputPath, JSON.stringify(fallbackData, null, 2));
    console.log('⚠️  Written fallback discussions data');
  }
}

main();
