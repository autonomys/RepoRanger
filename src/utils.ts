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

export const fetchAllFiles = async (repo: string, path = '') => {
  try {
    const url = `https://api.github.com/repos/${repo}/contents/${path}`;
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(
        `Error fetching files: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    let files: GitHubFile[] = [];

    for (const file of data) {
      if (file.type === 'dir') {
        const children = await fetchAllFiles(repo, file.path);
        files = files.concat(children);
      } else {
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

export const fetchFileContent = async (repo: string, path: string, signal: AbortSignal): Promise<string> => {
  const url = `https://api.github.com/repos/${repo}/contents/${path}`;
  const response = await fetch(url, { ...options, signal });

  if (response.ok) {
    const data = await response.json();
    const content = atob(data.content);
    console.log('content', content)
    return content;
  } else {
    throw new Error(`Failed to fetch file content: ${response.statusText}`);
  }
};
