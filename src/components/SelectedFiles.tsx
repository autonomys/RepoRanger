import { GitHubFile } from '../types';
import { CharacterCount, SelectedFileList, CopyToClipboardButton } from './';
import { useFileContents } from '../useFileContents';

const CHARACTER_LIMIT = 15000;

export const SelectedFiles: React.FC<{
  selectedFiles: Set<string>;
  files: GitHubFile[];
  repo: string;
  branch: string;
}> = ({ selectedFiles, files, repo, branch }) => {
  const { contents, totalCharCount, memoizedSelectedFiles } = useFileContents(
    selectedFiles,
    repo,
    branch
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4 gap-4">
        <CharacterCount
          totalCharCount={totalCharCount}
          charLimit={CHARACTER_LIMIT}
        />
        {selectedFiles.size ? (
          <CopyToClipboardButton
            content={[...contents.values()].join('\n\n')}
          />
        ) : null}
      </div>
      {selectedFiles.size > 0 ? (
        <>
          <h2 className="font-semibold">Selected Files:</h2>
          <SelectedFileList
            selectedFiles={memoizedSelectedFiles}
            files={files}
            selectedFileContents={contents}
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
