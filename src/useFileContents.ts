import { useState, useEffect, useMemo } from 'react';
import { fetchFileContent } from './api';

interface FileContents {
  contents: Map<string, string>;
  totalCharCount: number;
  memoizedSelectedFiles: string[];
}

export const useFileContents = (
  selectedFiles: Set<string>,
  repo: string,
  branch: string
): FileContents => {
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

  const memoizedSelectedFiles = useMemo(() => {
    return [...selectedFiles];
  }, [selectedFiles]);

  useEffect(() => {
    const abortController = new AbortController();

    if (memoizedSelectedFiles.length === 0) {
      setSelectedFileContents(new Map());
      return;
    }

    const promises: Promise<void>[] = [];
    const newSelectedFileContents = new Map(
      memoizedSelectedFiles.map((path) => [path, ''])
    );

    memoizedSelectedFiles.forEach((path) => {
      const promise = fetchFileContent(
        repo,
        branch,
        path,
        abortController.signal
      )
        .then(({ content }) => {
          newSelectedFileContents.set(path, content || '');
        })
        .catch((error) => {
          console.error(`Error fetching file content for ${path}:`, error);
        });
      promises.push(promise);
    });
    Promise.all(promises).then(() => {
      setSelectedFileContents(newSelectedFileContents);
    });

    return () => {
      abortController.abort();
    };
  }, [memoizedSelectedFiles, repo, branch]);

  return { contents: selectedFileContents, totalCharCount, memoizedSelectedFiles };
};
