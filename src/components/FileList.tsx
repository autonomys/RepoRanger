import React, { useEffect, useState } from 'react';
import { FileTree } from './FileTree';
import { RepositoryInput } from './RepositoryInput';
import { fetchAllFiles, getSelectedFiles, fetchBranches } from '../utils';
import { GitHubFile } from '../types';
import { SelectedFiles } from './SelectedFiles';
import { BranchSelector } from './BranchSelector';

export const FileList: React.FC = () => {
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [repo, setRepo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [branches, setBranches] = useState<string[]>([]);

  useEffect(() => {
    let isCancelled = false;

    if (repo) {
      setIsLoading(true);
      fetchAllFiles(repo, selectedBranch).then((data) => {
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
  }, [repo, selectedBranch]);

  const handleRepoSubmit = async (repo: string) => {
    try {
      const branches = await fetchBranches(repo).then((branches) =>
        branches.sort((a, b) => {
          // Sorting branches so that 'main' or 'master' always comes first
          if (a === 'main' || a === 'master') return -1;
          if (b === 'main' || b === 'master') return 1;
          return a.localeCompare(b);
        })
      );
  
      setBranches(branches);
      setSelectedBranch(branches[0]);
      setRepo(repo);
    } catch (error) {
      alert('Failed to fetch repository branches');
    }
  };  
  
  const handleSelection = (file: GitHubFile) => {
    setSelectedFiles((prevSelectedFiles) =>
      getSelectedFiles(prevSelectedFiles, file)
    );
  };

  return (
    <div>
      <RepositoryInput onSubmit={handleRepoSubmit} />
      <BranchSelector
        branches={branches}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
      />
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
        {repo && (
          <div className="md:col-span-2">
            <div className="bg-white shadow p-6 rounded">
              <SelectedFiles
                selectedFiles={selectedFiles}
                files={files}
                repo={repo}
                branch={selectedBranch}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
