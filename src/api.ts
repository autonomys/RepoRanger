import { GitHubFile } from './types';

const options = {
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
  }
}

export const fetchAllFiles = async (repo: string, branch: string, signal?: AbortSignal): Promise<GitHubFile[]> => {
  const recursiveQueryParam = '?recursive=1';
  const url = `https://api.github.com/repos/${repo}/git/trees/${branch}${recursiveQueryParam}`;
  const response = await fetch(url, { ...options, signal });

  if (!response.ok) {
    throw new Error(
      `Error fetching files: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()).tree;
  if (!Array.isArray(data)) {
    throw new Error('Unexpected response format from GitHub API');
  }

  const files: GitHubFile[] = data
    .filter((file) => file.type === 'blob')
    .map((file, index) => ({
      name: file.name,
      path: file.path,
      index,
    }));

  return files;
};

export const fetchFileContent = async (
  repo: string,
  branch: string,
  path: string,
  signal?: AbortSignal
): Promise<{ content: string; size: number; encoding: string }> => {
  const url = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;
  const response = await fetch(url, { ...options, signal });

  if (!response.ok) {
    throw new Error(
      `Error fetching file content: ${response.status} ${response.statusText}`
    );
  }

  const json = await response.json();
  if (Array.isArray(json) || !json.content || !json.size) {
    throw new Error('Unexpected response format from GitHub API');
  }

  try {
    const content = atob(json.content);
    const size = json.size;
    const encoding = 'base64'; // Hardcoded for now, but could be updated if other encoding formats are used in the future
    return { content, size, encoding };
  } catch (error) {
    throw new Error('Failed to decode file content: Invalid base64-encoded string');
  }
};

export const fetchBranches = async (repo: string): Promise<{ name: string, lastCommit: { hash: string, message: string, timestamp: string } }[]> => {
  const url = `https://api.github.com/repos/${repo}/branches`;
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error('Failed to fetch branches');
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Unexpected response format from GitHub API');
  }

  const branchPromises = data.map(async (branch) => {
    const commitUrl = `https://api.github.com/repos/${repo}/commits/${branch.commit.sha}`;
    const commitResponse = await fetch(commitUrl, options);

    if (!commitResponse.ok) {
      throw new Error('Failed to fetch last commit for branch');
    }

    const commitData = await commitResponse.json();
    return {
      name: branch.name,
      lastCommit: {
        hash: commitData.sha,
        message: commitData.commit.message,
        timestamp: commitData.commit.author.date,
      },
    };
  });

  const branches = await Promise.all(branchPromises);
  return branches;
};
