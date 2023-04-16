import { getSelectedFiles, sortFilesBySelection } from '../utils';
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

describe('getSelectedFiles', () => {
  it('should add single file to selectedFiles', () => {
    const file: GitHubFile = {
      name: 'test1',
      path: 'path/to/test1',
      index: 0,
    };
    const prevSelectedFiles = new Set<string>();
    const selectedFiles = getSelectedFiles(prevSelectedFiles, file);

    const result = new Set([file.path]);
    expect(selectedFiles).toEqual(result);
  });

  it('should remove single file from selectedFiles', () => {
    const file: GitHubFile = {
      name: 'test1',
      path: 'path/to/test1',
      index: 0,
    };
    const prevSelectedFiles = new Set<string>([file.path]);
    const selectedFiles = getSelectedFiles(prevSelectedFiles, file);

    const result = new Set();
    expect(selectedFiles).toEqual(result);
    expect(selectedFiles.size).toEqual(0);
  });
});
