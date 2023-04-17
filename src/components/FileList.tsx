import { useState, useMemo } from 'react';
import { FileTree, FileSearchBar } from './';
import { GitHubFile } from '../types';
import { sortFilesBySelection } from '../utils';

interface FileListProps {
  files: GitHubFile[];
  selectedFiles: Set<string>;
  handleSelection: (file: GitHubFile) => void;
  selectedFileExtension: string;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  selectedFiles,
  handleSelection,
  selectedFileExtension,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // const sortedFiles = sortFilesBySelection(files, selectedFiles);

  const displayedFiles = useMemo(() => {
    let filesToDisplay = files;
    
    if (selectedFileExtension) {
      filesToDisplay = files.filter((file) =>
        file.path.endsWith(selectedFileExtension)
      );
    }

    return sortFilesBySelection(filesToDisplay, selectedFiles);
  }, [files, selectedFiles, selectedFileExtension]);

  const filteredFiles = displayedFiles.filter((file) =>
    file.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white shadow p-6 rounded">
      <h2 className="font-semibold mb-4">Files:</h2>
      <FileSearchBar value={searchQuery} onChange={setSearchQuery} />
      <ul className="list-none">
        {filteredFiles.map((file, index) => (
          <FileTree
            key={`${file.path}-${index}`}
            file={file}
            selectedFiles={selectedFiles}
            onSelection={handleSelection}
          />
        ))}
      </ul>
    </div>
  );
};
