import React, { useState, useEffect } from 'react';
import { GitHubFile } from './types';
import { fetchFileContent } from './utils';

export const SelectedFiles: React.FC<{
  selectedFiles: Set<string>;
  files: GitHubFile[];
  repo: string;
}> = ({ selectedFiles, files, repo }) => {
  const [selectedFileContents, setSelectedFileContents] = useState<
    Map<string, string>
  >(new Map());

  useEffect(() => {
    const abortController = new AbortController();
    const promises: Promise<void>[] = [];
    const newSelectedFileContents = new Map(
      [...selectedFiles].map((path) => [path, ''])
    );
    selectedFiles.forEach((path) => {
      const promise = fetchFileContent(repo, path, abortController.signal).then(
        (content) => {
          newSelectedFileContents.set(path, content);
        }
      );
      promises.push(promise);
    });
    Promise.all(promises).then(() => {
      setSelectedFileContents(newSelectedFileContents);
    });

    return () => {
      abortController.abort();
    };
  }, [selectedFiles, repo]);

  const handleCopy = () => {
    const content = [...selectedFileContents.values()].join('\n\n');
    navigator.clipboard.writeText(content).then(() => {
      alert('Contents copied to clipboard.');
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className='font-bold'>Selected Files:</h2>
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
        <pre className="bg-gray-100 p-4 rounded">
          {[...selectedFiles].map((path, index) => {
            const file = files.find((f) => f.path === path);
            if (file) {
              return (
                <div key={`${file.path}-${index}`}>
                  <h3 className="font-semibold">
                    {index + 1}. file: {file.path}
                  </h3>
                  <p>{selectedFileContents.get(path)}</p>
                </div>
              );
            } else {
              return null;
            }
          })}
        </pre>
      ) : (
        <p className="text-gray-600">
          Please select files to view their content.
        </p>
      )}
    </div>
  );
};
