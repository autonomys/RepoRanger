// src/FileTree.tsx
import React, { useState } from 'react';

interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  children?: GitHubFile[];
}

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
  const [expanded, setExpanded] = useState(false);
  const isSelected = selectedFiles.has(file.path);
  const isFolder = file.type === 'dir';

  const handleToggleExpandClick = async () => {
    if (isFolder) {
      setExpanded(!expanded);
    }
  };

  return (
    <li className="pl-2">
      <div
        className={`cursor-pointer flex items-center ${
          isSelected ? 'bg-blue-200' : ''
        }`}
      >
        {isFolder && (
          <button
            className={`mr-1 text-xs bg-blue-500 text-white rounded px-1 focus:outline-none ${
              expanded ? 'bg-blue-600' : ''
            }`}
            onClick={handleToggleExpandClick}
          >
            {expanded ? '-' : '+'}
          </button>
        )}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelection(file)}
          className="mr-1"
        />
        {file.name}
        {isFolder && `(${file.children?.length})`}
      </div>
      {expanded && (
        <ul className="list-none pl-4">
          {file.children?.map((child, index) => (
            <FileTree
              key={index}
              file={child}
              selectedFiles={selectedFiles}
              onSelection={onSelection}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
