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

export const sortFilesBySelection = (
  files: GitHubFile[],
  selectedFiles: Set<string>
): GitHubFile[] => {
  return [...files].sort((a, b) => {
    const aSelected = selectedFiles.has(a.path) ? 1 : 0;
    const bSelected = selectedFiles.has(b.path) ? 1 : 0;

    if (aSelected === bSelected) {
      return a.index - b.index;
    }

    return bSelected - aSelected;
  });
};

export function formatNumber(number: number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function getFileExtensions(files: GitHubFile[]): string[] {
  const extensions = files.reduce((acc: string[], file: GitHubFile) => {
    const fileNameParts = file.name.split('.');
    if (fileNameParts.length > 1 && (fileNameParts[0] !== '' || fileNameParts.length > 2)) {
      const ext = fileNameParts.pop()!;
      if (!acc.includes(ext)) {
        acc.push(ext);
      }
    }
    return acc;
  }, []);

  return extensions;
}


