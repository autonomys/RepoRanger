import { memo, useState, useEffect, useMemo } from 'react';
import { GitHubFile } from '../../types';
import { Loading, Button } from '..';
import { CharacterCount } from './CharacterCount';
import { Contents } from './Contents';
import { fetchFileContent } from '../../api';

const CHARACTER_LIMIT = 15000;

interface ResultProps {
  files: GitHubFile[];
  repo: string;
  branch: string;
  isLoadingFileContents: boolean;
  clearFiles: () => void;
  setContentsLoading: (isLoading: boolean) => void;
  toggleContentCollapse: (path: string) => void;
}

export const Result: React.FC<ResultProps> = memo(
  ({
    files,
    repo,
    branch,
    isLoadingFileContents,
    clearFiles,
    setContentsLoading,
    toggleContentCollapse,
  }) => {
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

      const promises: Promise<void>[] = [];
      const newSelectedFileContents = new Map(
        [...files].map(({ path }) => [path, ''])
      );

      setContentsLoading(true);

      files.forEach(({ path }) => {
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
            alert(`Error fetching file content for ${path}`);
          });
        promises.push(promise);
      });

      Promise.all(promises).then(() => {
        setSelectedFileContents(newSelectedFileContents);
        setContentsLoading(false);
      });

      return () => {
        abortController.abort();
      };
    }, [repo, branch, setContentsLoading, files]);

    const handleDownload = () => {
      const fileContent = [...selectedFileContents.values()].join('\n\n');
      const blob = new Blob([fileContent], {
        type: 'text/plain;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${repo}-${branch}-selected-files.txt`;
      link.click();
      URL.revokeObjectURL(url);
    };

    const handleCopy = () => {
      const fileContent = [...selectedFileContents.values()].join('\n\n');
      navigator.clipboard.writeText(fileContent).then(() => {
        alert('Contents copied to clipboard.');
      });
    };

    return (
      <div>
        <div className="flex justify-between items-start mb-4 gap-2">
          <CharacterCount
            totalCharCount={totalCharCount}
            charLimit={CHARACTER_LIMIT}
          />
          {files.length ? (
            <>
              <Button onClick={handleCopy}>Copy</Button>
              <Button onClick={handleDownload}>Download</Button>
              <Button variant="danger" onClick={clearFiles}>
                Clear
              </Button>
            </>
          ) : null}
        </div>
        {isLoadingFileContents ? (
          <Loading />
        ) : files.length > 0 ? (
          <Contents
            selectedFiles={files}
            selectedFileContents={selectedFileContents}
            handleFileCollapse={toggleContentCollapse}
          />
        ) : (
          <p className="text-gray-600">
            Please select files to view their content.
          </p>
        )}
      </div>
    );
  }
);
