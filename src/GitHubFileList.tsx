// src/GitHubFileList.tsx
import React, { useEffect, useState } from 'react';
import { FileTree } from './FileTree';
import { GitHubRepositoryInput } from './GitHubRepositoryInput';

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  children?: GitHubFile[];
}

export const getSelectedFiles = (prevSelectedFiles: Set<string>, file: GitHubFile) => {
  const newSelectedFiles = new Set(prevSelectedFiles);

  if (newSelectedFiles.has(file.path)) {
    newSelectedFiles.delete(file.path);

    // deselect all children if it's a directory and it's being deselected
    if (file.type === 'dir') {
      file.children?.forEach((child) => {
        newSelectedFiles.delete(child.path);

        if (child.type === 'dir') {
          const deselectChildrenRecursively = (child: GitHubFile) => {
            child.children?.forEach((subchild) => {
              newSelectedFiles.delete(subchild.path);
              if (subchild.type === 'dir') {
                deselectChildrenRecursively(subchild);
              }
            });
          };
          deselectChildrenRecursively(child);
        }
      });

      // deselect folder if all children were deselected
      let parentPath = file.path.split('/').slice(0, -1).join('/');
      while (parentPath && parentPath !== file.path.split('/')[0]) {
        const parent = file.children?.find((child) => child.path === parentPath);
        if (parent && parent.type === 'dir' && !parent.children?.some((child) => newSelectedFiles.has(child.path))) {
          newSelectedFiles.delete(parent.path);
          parentPath = parent.path.split('/').slice(0, -1).join('/');
        } else {
          break;
        }
      }
    }
  } else {
    newSelectedFiles.add(file.path);

    if (file.type === 'dir') {
      file.children?.forEach((child) => {
        newSelectedFiles.add(child.path);
        if (child.type === 'dir') {
          const selectChildrenRecursively = (child: GitHubFile) => {
            child.children?.forEach((subchild) => {
              newSelectedFiles.add(subchild.path);
              if (subchild.type === 'dir') {
                selectChildrenRecursively(subchild);
              }
            });
          };
          selectChildrenRecursively(child);
        }
      });

      // select all parents recursively
      let parentPath = file.path.split('/').slice(0, -1).join('/');
      while (parentPath && parentPath !== file.path.split('/')[0]) {
        const parent = file.children?.find((child) => child.path === parentPath);
        if (parent) {
          newSelectedFiles.add(parent.path);
          parentPath = parent.path.split('/').slice(0, -1).join('/');
        } else {
          break;
        }
      }
    }
  }

  return newSelectedFiles;
};

export const GitHubFileList: React.FC = () => {
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [repo, setRepo] = useState('');

  const fetchAllFiles = async (repo: string, path = '') => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repo}/contents/${path}`
      );
      if (!response.ok) {
        throw new Error(
          `Error fetching files: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      let files: GitHubFile[] = [];

      for (const file of data) {
        let children;

        if (file.type === 'dir') {
          children = await fetchAllFiles(repo, file.path);
        }

        files.push({
          name: file.name,
          path: file.path,
          type: file.type,
          children,
        });
      }

      return files;
    } catch (error) {
      console.error('Error fetching files:', error);
      return [];
    }
  };

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
    <>
      <GitHubRepositoryInput onSubmit={handleRepoSubmit} />
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
    </>
  );
};
