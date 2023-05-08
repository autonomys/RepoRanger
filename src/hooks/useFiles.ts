import { useState, useEffect, useMemo } from 'react';
import { fetchAllFiles } from '../api';
import { GitHubFile, Notification } from '../types';
import { getFileExtensions } from '../utils';

export function useFiles(repo: string, selectedBranch: string | undefined, lastCommit: string | undefined, setNotification: (n: Notification) => void) {
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [fileExtensions, setFileExtensions] = useState<string[]>([]);
  const [isLoadingRepoFiles, setIsLoadingRepoFiles] = useState(false);
  const [loadRepoFilesError, setLoadRepoFilesError] = useState<null | string>(
    null
  );

  useEffect(() => {
    let isCancelled = false;

    const fetchBranchFiles = async () => {
      setLoadRepoFilesError(null);
      if (repo && selectedBranch) {
        setIsLoadingRepoFiles(true);
        try {
          const files = await fetchAllFiles(repo, selectedBranch);
          const fileExtensions = getFileExtensions(files);

          if (!isCancelled) {
            setFiles(files);
            setFileExtensions(fileExtensions);
          }
        } catch (error) {
          const errorMessage = 'Failed to fetch repository files';
          console.error(errorMessage, error);
          setLoadRepoFilesError(errorMessage);
          setNotification({
            message: errorMessage,
            type: 'error',
          });
        } finally {
          setIsLoadingRepoFiles(false);
        }
      }
    };

    if (repo && selectedBranch) {
      fetchBranchFiles();
    }

    return () => {
      isCancelled = true;
      setIsLoadingRepoFiles(false);
    };
  }, [repo, selectedBranch, loadRepoFilesError, lastCommit, setNotification]);

  const toggleFileSelect = (filePath: string) => {
    setFiles((files) =>
      files.map((file) => {
        if (file.path === filePath) {
          return {
            ...file,
            isSelected: !file.isSelected,
            isCollapsed: file.isSelected ? file.isCollapsed : false,
          };
        }
        return file;
      })
    );
  };

  const clearSelectedFiles = () => {
    setFiles((files) =>
      files.map((file) => ({ ...file, isSelected: false, isCollapsed: false }))
    );
  };

  const selectedFiles = useMemo(() => {
    return files.filter((file) => file.isSelected);
  }, [files]);

  const toggleContentCollapse = (filePath: string) => {
    setFiles((files) =>
      files.map((file) => {
        if (file.path === filePath) {
          return { ...file, isCollapsed: !file.isCollapsed };
        }
        return file;
      })
    );
  };

  return {
    files,
    isLoadingRepoFiles,
    loadRepoFilesError,
    fileExtensions,
    toggleFileSelect,
    clearSelectedFiles,
    selectedFiles,
    toggleContentCollapse,
  };
}
