import { sortFilesBySelection } from '../utils';
import { GitHubFile } from '../types';

describe('sortFilesBySelection', () => {
  const files: GitHubFile[] = [
    { name: 'file1', path: 'path1', index: 0 },
    { name: 'file2', path: 'path2', index: 1 },
    { name: 'file3', path: 'path3', index: 2 },
  ];

  test('should return the original order when no files are selected', () => {
    const selectedFiles = new Set<string>();
    const sortedFiles = sortFilesBySelection(files, selectedFiles);
    expect(sortedFiles).toEqual(files);
  });

  test('should move selected files to the top of the list', () => {
    const selectedFiles = new Set<string>(['path2']);
    const sortedFiles = sortFilesBySelection(files, selectedFiles);
    expect(sortedFiles).toEqual([
      { name: 'file2', path: 'path2', index: 1 },
      { name: 'file1', path: 'path1', index: 0 },
      { name: 'file3', path: 'path3', index: 2 },
    ]);
  });

  test('should maintain the original order of unselected files', () => {
    const selectedFiles = new Set<string>(['path1', 'path3']);
    const sortedFiles = sortFilesBySelection(files, selectedFiles);
    expect(sortedFiles).toEqual([
      { name: 'file1', path: 'path1', index: 0 },
      { name: 'file3', path: 'path3', index: 2 },
      { name: 'file2', path: 'path2', index: 1 },
    ]);
  });
});
