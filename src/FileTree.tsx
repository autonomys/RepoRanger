// src/FileTree.tsx
import { GitHubFile } from './types';

interface FileTreeProps {
  file: GitHubFile;
  selectedFiles: Set<string>;
  onSelection: (file: GitHubFile) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({
  file,
  selectedFiles,
  onSelection,
}) => {
  const isSelected = selectedFiles.has(file.path);
  return (
    <li className="pl-2">
      <div
        className={`cursor-pointer flex items-center ${
          isSelected ? 'bg-blue-200' : ''
        }`}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelection(file)}
          className="mr-1"
        />
        {file.path}
      </div>
    </li>
  );
};
