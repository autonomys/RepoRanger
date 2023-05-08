import { useState, useEffect, useMemo } from 'react';
import { fetchFileContent } from '../api';
import { GitHubFile, Notification } from '../types';

export function useResult(files: GitHubFile[], repo: string, branchName: string, setNotification: (n: Notification) => void) {
  const [isLoadingFileContents, setContentsLoading] = useState(false);
  const [loadFileContentsError, setLoadFileContentsError] = useState<null | string>(
    null
  );

  const [selectedFileContents, setSelectedFileContents] = useState<
    Map<string, string>
  >(new Map());

  const totalCharCount = useMemo(() => {
    let totalChars = 0;
    selectedFileContents.forEach((content) => {
      totalChars += content.length;
    });
    return totalChars;
  }, [selectedFileContents]);

  useEffect(() => {
    const abortController = new AbortController();

    if (files.length === 0) {
      setSelectedFileContents(new Map());
      return;
    }

    const newSelectedFileContents = new Map(
      [...files].map(({ path }) => [path, ''])
    );

    if (repo && branchName) {

      setContentsLoading(true);

      const promises = files.map(({ path }) => {
        setLoadFileContentsError(null);
        return fetchFileContent(repo, branchName!, path, abortController.signal)
          .then(({ content }) => {
            newSelectedFileContents.set(path, content || '');
          })
          .catch((error) => {
            const errorMessage = `Error fetching file content for ${path}`;
            console.error(`${errorMessage}:`, error);
            setLoadFileContentsError(errorMessage);
            setNotification({
              message: errorMessage,
              type: 'error',
            });
          });
      });

      Promise.all(promises).then(() => {
        setSelectedFileContents(newSelectedFileContents);
        setContentsLoading(false);
      });
    }

    return () => {
      abortController.abort();
    };
  }, [repo, branchName, setContentsLoading, files, setNotification]);

  const handleDownload = () => {
    const fileContent = [...selectedFileContents.values()].join('\n\n');
    const blob = new Blob([fileContent], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${repo}-${branchName}-selected-files.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const fileContent = [...selectedFileContents.values()].join('\n\n');
    navigator.clipboard.writeText(fileContent).then(() => {
      setNotification({
        message: 'Contents copied to clipboard.',
        type: 'success',
      });
    });
  };

  return {
    isLoadingFileContents,
    setContentsLoading,
    totalCharCount,
    loadFileContentsError,
    handleDownload,
    handleCopy,
    selectedFileContents,
  };
}
