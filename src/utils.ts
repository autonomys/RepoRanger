import { GitHubFile } from './types';

export const getSelectedFiles = (prevSelectedFiles: Set<string>, file: GitHubFile) => {
  const newSelectedFiles = new Set(prevSelectedFiles);

  if (newSelectedFiles.has(file.path)) {
    newSelectedFiles.delete(file.path);
  } else {
    newSelectedFiles.add(file.path);
  }

  return newSelectedFiles;
};

const options = {
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
  }
}

export const fetchAllFiles = async (repo: string, branch: string, path = '') => {
  if (!process.env.REACT_APP_GITHUB_TOKEN) {
    throw new Error('GitHub token not found. Please set the REACT_APP_GITHUB_TOKEN environment variable.');
  }

  try {
    const url = `https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`;
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(
        `Error fetching files: ${response.status} ${response.statusText}`
      );
    }
    const data = (await response.json()).tree;
    let files: GitHubFile[] = [];

    for (const file of data) {
      if (file.type === 'blob') {
        files.push({
          name: file.name,
          path: file.path,
        });
      }
    }

    return files;
  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
};

export const fetchFileContent = async (
  repo: string,
  branch: string,
  path: string,
  signal?: AbortSignal
): Promise<{ content: string; size: number }> => {
  const url = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;
  const response = await fetch(url, { ...options, signal });
  const json = await response.json();

  if (Array.isArray(json)) {
    throw new Error('Unexpected response from GitHub API');
  }

  if (json.content === undefined || json.size === undefined) {
    throw new Error('Missing content or size in GitHub API response');
  }

  try {
    const content = atob(json.content);
    const size = json.size;
    return { content, size };
  } catch (error) {
    throw new Error('Failed to decode file content: Invalid base64-encoded string');
  }
};

export const fetchBranches = async (repo: string): Promise<string[]> => {
  const url = `https://api.github.com/repos/${repo}/branches`;
  const response = await fetch(url, options);
  if (response.ok) {
    const data = await response.json();
    return data.map((branch: { name: string }) => branch.name);
  } else {
    throw new Error('Failed to fetch branches');
  }
};

