import { memo } from 'react';
import { GitHubFile } from '../../types';
import { Loading, Button } from '..';
import { CharacterCount } from './CharacterCount';
import { Contents } from './Contents';
import { useFileContents } from '../../hooks/useFileContents';

const CHARACTER_LIMIT = 15000;

export const Result: React.FC<{
  selectedFiles: Set<string>;
  files: GitHubFile[];
  repo: string;
  branch: string;
  isLoadingFileContents: boolean;
  handleClearFiles: () => void;
  setContentsLoading: (isLoading: boolean) => void;
  handleFileCollapse: (path: string) => void;
  collapsedFiles: Set<string>;
}> = memo(({
  selectedFiles,
  files,
  repo,
  branch,
  isLoadingFileContents,
  handleClearFiles,
  setContentsLoading,
  collapsedFiles,
  handleFileCollapse,
}) => {
  const { contents, totalCharCount, memoizedSelectedFiles } = useFileContents(
    selectedFiles,
    repo,
    branch,
    setContentsLoading
  );

  const handleDownload = () => {
    const fileContent = [...contents.values()].join('\n\n');
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${repo}-${branch}-selected-files.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const fileContent = [...contents.values()].join('\n\n');
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
        {selectedFiles.size ? (
          <>
            <Button onClick={handleCopy}>Copy</Button>
            <Button onClick={handleDownload}>Download</Button>
            <Button variant="danger" onClick={handleClearFiles}>
              Clear
            </Button>
          </>
        ) : null}
      </div>
      {isLoadingFileContents ? (
        <Loading />
      ) : selectedFiles.size > 0 ? (
        <Contents
          selectedFiles={memoizedSelectedFiles}
          files={files}
          selectedFileContents={contents}
          collapsedFiles={collapsedFiles}
          handleFileCollapse={handleFileCollapse}
        />
      ) : (
        <p className="text-gray-600">
          Please select files to view their content.
        </p>
      )}
    </div>
  );
});
