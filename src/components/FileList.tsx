import { useState } from 'react';
import { FileTree, FileSearchBar } from './';
import { GitHubFile } from '../types';
import { sortFilesBySelection } from '../utils';

interface FileListProps {
  files: GitHubFile[];
  selectedFiles: Set<string>;
  handleSelection: (file: GitHubFile) => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  selectedFiles,
  handleSelection,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const sortedFiles = sortFilesBySelection(files, selectedFiles);

  const filteredFiles = sortedFiles.filter((file) =>
    file.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white shadow p-6 rounded">
      <h2 className="font-bold mb-4">Files:</h2>
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
