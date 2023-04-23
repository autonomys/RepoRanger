import { GitHubFile } from './types';

export const sortFilesBySelection = (
  files: GitHubFile[]
): GitHubFile[] => {
  return files.sort((a, b) => {
    if (a.isSelected && !b.isSelected) {
      return -1;
    }
    if (!a.isSelected && b.isSelected) {
      return 1;
    }
    return 0;
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


