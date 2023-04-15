// src/GitHubFileList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileTree } from './FileTree';
import { GitHubRepositoryInput } from './GitHubRepositoryInput';

interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
}

export const GitHubFileList: React.FC = () => {
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [repo, setRepo] = useState('');

  const fetchFiles = async (path: string = '') => {
    if (!repo) return;
    const response = await axios.get(
      `https://api.github.com/repos/${repo}/contents/${path}`
    );
    return response.data;
  };

  useEffect(() => {
    if (repo) {
      fetchFiles().then(data => setFiles(data));
    }
  }, [repo]);

  const handleSelection = (file: GitHubFile) => {
    setSelectedFiles(prevSelectedFiles => {
      const newSelectedFiles = new Set(prevSelectedFiles);
      if (newSelectedFiles.has(file.path)) {
        newSelectedFiles.delete(file.path);
      } else {
        newSelectedFiles.add(file.path);
      }
      return newSelectedFiles;
    });
  };

  const handleRepoSubmit = (repo: string) => {
    setRepo(repo);
  };

  return (
    <>
      <GitHubRepositoryInput onSubmit={handleRepoSubmit} />
      <ul className="list-none">
        {files.map((file, index) => (
          <FileTree key={index} file={file} selectedFiles={selectedFiles} onSelection={handleSelection} fetchFiles={fetchFiles} />
        ))}
      </ul>
    </>
  );
};
