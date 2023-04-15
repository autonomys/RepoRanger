import React, { useEffect, useState } from 'react';
import { FileTree } from './FileTree';
import { RepositoryInput } from './RepositoryInput';
import { fetchAllFiles, getSelectedFiles } from '../utils';
import { GitHubFile } from '../types';
import { SelectedFiles } from './SelectedFiles';

export const FileList: React.FC = () => {
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [repo, setRepo] = useState('');

  useEffect(() => {
    let isCancelled = false;

    if (repo) {
      fetchAllFiles(repo).then((data) => {
        if (!isCancelled) {
          setFiles(data);
        }
      });
    }

    return () => {
      isCancelled = true;
    };
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
    <div className="container mx-auto">
      <RepositoryInput onSubmit={handleRepoSubmit} />
      {repo ? (
        <div className="flex mt-6">
          <div className="w-1/3 bg-white shadow p-6 mr-6 rounded">
            <h2 className="font-bold mb-4">Files:</h2>
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
          <div className="w-2/3 bg-white shadow p-6 rounded">
            <SelectedFiles
              selectedFiles={selectedFiles}
              files={files}
              repo={repo}
            />
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-gray-600">Please submit a GitHub repository URL to display its files.</p>
        </div>
      )}
    </div>
  );
};
