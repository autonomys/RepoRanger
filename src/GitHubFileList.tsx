// src/GitHubFileList.tsx
import React, { useEffect, useState } from 'react';
import { FileTree } from './FileTree';
import { GitHubRepositoryInput } from './GitHubRepositoryInput';
import { fetchAllFiles, getSelectedFiles } from './utils';
import { GitHubFile } from './types';
import { SelectedFiles } from './SelectedFiles';

export const GitHubFileList: React.FC = () => {
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [repo, setRepo] = useState('');

  useEffect(() => {
    if (repo) {
      fetchAllFiles(repo).then((data) => setFiles(data));
    }
  }, [repo]);

  const handleRepoSubmit = (repo: string) => {
    setRepo(repo);
  };

  const handleSelection = (file: GitHubFile) => {
    setSelectedFiles((prevSelectedFiles) =>
      getSelectedFiles(prevSelectedFiles, file)
    );
  };

  return (
    <div>
      <GitHubRepositoryInput onSubmit={handleRepoSubmit} />
      <div className="flex">
        <div className="w-1/3">
          <ul className="list-none">
            {files.map((file, index) => (
              <FileTree
                key={`${file.path}-${index}`}
                file={file}
                selectedFiles={selectedFiles}
                onSelection={handleSelection}
              />
            ))}
          </ul>
        </div>
        <div className="w-2/3">
          <SelectedFiles selectedFiles={selectedFiles} files={files} />
        </div>
      </div>
    </div>
  );
};
