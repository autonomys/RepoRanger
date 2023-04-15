import { getSelectedFiles, GitHubFile } from './GitHubFileList';

describe('getSelectedFiles', () => {
  it('should add single file to selectedFiles', () => {
    const file: GitHubFile = {
      name: 'test1',
      path: 'path/to/test1',
      type: 'file',
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
      type: 'file',
    };
    const prevSelectedFiles = new Set<string>([file.path]);
    const selectedFiles = getSelectedFiles(prevSelectedFiles, file);

    const result = new Set();
    expect(selectedFiles).toEqual(result);
    expect(selectedFiles.size).toEqual(0);
  });

  it('should add folder with children files', () => {
    const file: GitHubFile = {
      name: 'test2',
      path: 'path/to/test2',
      type: 'dir',
      children: [
        {
          name: 'test3',
          path: 'path/to/test2/test3',
          type: 'file',
        }
      ]
    };
    const prevSelectedFiles = new Set<string>();
    const selectedFiles = getSelectedFiles(prevSelectedFiles, file);

    const result = new Set([file.path, file.children![0].path]);
    expect(selectedFiles).toEqual(result);
    expect(selectedFiles.size).toEqual(2);
  });

  it('should remove folder with children files', () => {
    const file: GitHubFile = {
      name: 'test2',
      path: 'path/to/test2',
      type: 'dir',
      children: [
        {
          name: 'test3',
          path: 'path/to/test2/test3',
          type: 'file',
        }
      ]
    };
    const prevSelectedFiles = new Set<string>([file.path, file.children![0].path]);
    const selectedFiles = getSelectedFiles(prevSelectedFiles, file);

    const result = new Set();
    expect(selectedFiles).toEqual(result);
    expect(selectedFiles.size).toEqual(0);
  });
});
