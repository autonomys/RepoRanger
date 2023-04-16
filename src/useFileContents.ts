import { useState, useEffect, useMemo } from 'react';
import { fetchFileContent } from './api';

interface FileContents {
  contents: Map<string, string>;
  totalCharCount: number;
}

export const useFileContents = (
  selectedFiles: Set<string>,
  repo: string,
  branch: string
): FileContents => {
  const [selectedFileContents, setSelectedFileContents] = useState<
    Map<string, string>
  >(new Map());
  const [totalCharCount, setTotalCharCount] = useState<number>(0);

  const memoizedSelectedFiles = useMemo(() => {
    return [...selectedFiles];
  }, [selectedFiles]);

  useEffect(() => {
    const abortController = new AbortController();

    if (memoizedSelectedFiles.length === 0) {
      setTotalCharCount(0);
      return;
    }

    const promises: Promise<void>[] = [];
    const newSelectedFileContents = new Map(
      memoizedSelectedFiles.map((path) => [path, ''])
    );
    let totalChars = 0;
    memoizedSelectedFiles.forEach((path) => {
      const promise = fetchFileContent(
        repo,
        branch,
        path,
        abortController.signal
      )
        .then(({ content, size }) => {
          newSelectedFileContents.set(path, content || '');
          totalChars += size;
          setTotalCharCount(totalChars);
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

  return { contents: selectedFileContents, totalCharCount };
};
