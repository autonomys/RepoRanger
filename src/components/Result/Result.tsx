import { memo } from 'react';
import { Link } from 'react-router-dom';
import { GitHubFile } from '../../types';
import { Loading, Button } from '..';
import { CharacterCount } from './CharacterCount';
import { Contents } from './Contents';

const CHARACTER_LIMIT = 15000;

interface ResultProps {
  files: GitHubFile[];
  isLoadingFileContents: boolean;
  clearFiles: () => void;
  toggleContentCollapse: (path: string) => void;
  totalCharCount: number;
  handleCopy: () => void;
  handleDownload: () => void;
  selectedFileContents: Map<string, string>;
}

export const Result: React.FC<ResultProps> = memo(
  ({
    files,
    isLoadingFileContents,
    clearFiles,
    toggleContentCollapse,
    totalCharCount,
    handleCopy,
    handleDownload,
    selectedFileContents,
  }) => (
    <div>
      <div className="flex justify-between items-start mb-4 gap-2">
        <CharacterCount
          totalCharCount={totalCharCount}
          charLimit={CHARACTER_LIMIT}
        />
        {files.length ? (
          <>
            <Link to="/prompt">
              <Button>Chat</Button>
            </Link>
            <Button variant="secondary" onClick={handleCopy}>Copy</Button>
            <Button variant="secondary" onClick={handleDownload}>Download</Button>
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
        <p className="text-gray-600 dark:text-gray-400">
          Please select files to view their content.
        </p>
      )}
    </div>
  )
);
