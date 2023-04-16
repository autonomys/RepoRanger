import React, { useState, useEffect, useMemo } from 'react';
import { GitHubFile } from '../types';
import { fetchFileContent } from '../api';
import { formatNumber } from '../utils';

const CHARACTER_LIMIT = 15000;

export const SelectedFiles: React.FC<{
  selectedFiles: Set<string>;
  files: GitHubFile[];
  repo: string;
  branch: string;
}> = ({ selectedFiles, files, repo, branch }) => {
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

  const handleCopy = () => {
    const content = [...selectedFileContents.values()].join('\n\n');
    navigator.clipboard.writeText(content).then(() => {
      alert('Contents copied to clipboard.');
    });
  };

  const isCharLimitReached = totalCharCount > CHARACTER_LIMIT;

  return (
    <div>
      <div className="flex justify-between items-center mb-4 gap-4">
        <div className="mb-4">
          <div className="font-semibold mb-2">
            Total character count: {formatNumber(totalCharCount)} /{' '}
            {formatNumber(CHARACTER_LIMIT)}
          </div>
          <p
            className={`text-red-500 font-semibold text-sm ${
              isCharLimitReached ? 'visible' : 'invisible'
            }`}
          >
            Character limit exceeded. Please select fewer files or use{' '}
            <a
              className="underline"
              href="https://chatgpt-prompt-splitter.jjdiaz.dev/"
              target="_blank"
              rel="noreferrer"
            >
              ChatGPT PROMPTs Splitter
            </a>
          </p>
        </div>
        {selectedFiles.size ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleCopy}
          >
            Copy Contents
          </button>
        ) : null}
      </div>
      {selectedFiles.size > 0 ? (
        <>
          <h2 className="font-semibold">Selected Files:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {memoizedSelectedFiles.map((path, index) => {
              const file = files.find((f) => f.path === path);
              if (file) {
                const fileContent = selectedFileContents.get(path);
                return (
                  <div key={`${file.path}-${index}`}>
                    <h3 className="font-semibold">
                      {index + 1}. file: {file.path}
                    </h3>
                    <p>{fileContent}</p>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </pre>
        </>
      ) : (
        <p className="text-gray-600">
          Please select files to view their content.
        </p>
      )}
    </div>
  );
};
