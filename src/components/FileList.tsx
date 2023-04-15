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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    if (repo) {
      setIsLoading(true);
      fetchAllFiles(repo).then((data) => {
        if (!isCancelled) {
          setFiles(data);
          setIsLoading(false);
        }
      });
    }

    return () => {
      isCancelled = true;
      setIsLoading(false);
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
    <div>
      <RepositoryInput onSubmit={handleRepoSubmit} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : repo ? (
            <div className="bg-white shadow p-6 rounded">
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
          ) : (
            <div className="bg-white shadow p-6 rounded">
              <p className="text-gray-600">
                Please submit a GitHub repository URL to display its files.
              </p>
            </div>
          )}
        </div>
        {selectedFiles.size > 0 && (
          <div className="md:col-span-2">
            <div className="bg-white shadow p-6 rounded">
              <SelectedFiles
                selectedFiles={selectedFiles}
                files={files}
                repo={repo}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
