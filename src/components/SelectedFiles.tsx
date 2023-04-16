import { useState, useEffect, useMemo } from 'react';
import { GitHubFile } from '../types';
import { fetchFileContent } from '../api';
import { CharacterCount, SelectedFileList, CopyToClipboardButton } from './';

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

  return (
    <div>
      <div className="flex justify-between items-center mb-4 gap-4">
        <CharacterCount
          totalCharCount={totalCharCount}
          charLimit={CHARACTER_LIMIT}
        />
        {selectedFiles.size ? (
          <CopyToClipboardButton
            content={[...selectedFileContents.values()].join('\n\n')}
          />
        ) : null}
      </div>
      {selectedFiles.size > 0 ? (
        <>
          <h2 className="font-semibold">Selected Files:</h2>
          <SelectedFileList
            selectedFiles={memoizedSelectedFiles}
            files={files}
            selectedFileContents={selectedFileContents}
          />
        </>
      ) : (
        <p className="text-gray-600">
          Please select files to view their content.
        </p>
      )}
    </div>
  );
};
