import { getSelectedFiles } from './utils';
import { GitHubFile } from './types';

describe('getSelectedFiles', () => {
  it('should add single file to selectedFiles', () => {
    const file: GitHubFile = {
      name: 'test1',
      path: 'path/to/test1',
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
    };
    const prevSelectedFiles = new Set<string>([file.path]);
    const selectedFiles = getSelectedFiles(prevSelectedFiles, file);

    const result = new Set();
    expect(selectedFiles).toEqual(result);
    expect(selectedFiles.size).toEqual(0);
  });
});
