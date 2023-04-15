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

export const fetchAllFiles = async (repo: string, path = '') => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/contents/${path}`
    );
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
