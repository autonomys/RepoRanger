// src/FileTree.tsx
import React, { useState } from 'react';

interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
}

interface FileTreeProps {
  file: GitHubFile;
  selectedFiles: Set<string>;
  onSelection: (file: GitHubFile) => void;
  fetchFiles: (path: string) => Promise<GitHubFile[]>;
}

export const FileTree: React.FC<FileTreeProps> = ({ file, selectedFiles, onSelection, fetchFiles }) => {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState<GitHubFile[]>([]);
  const isSelected = selectedFiles.has(file.path);

  const handleClick = async () => {
    if (file.type === 'dir') {
      setExpanded(!expanded);
      if (!expanded && children.length === 0) {
        const newChildren = await fetchFiles(file.path);
        setChildren(newChildren);
      }
    }
  };

  return (
    <li className="pl-2">
      <div
        className={`cursor-pointer flex items-center ${isSelected ? 'bg-blue-200' : ''}`}
        onClick={() => onSelection(file)}
      >
        {file.type === 'dir' && (
          <span className={`mr-1 ${expanded ? 'text-blue-600' : ''}`} onClick={handleClick}>
            {expanded ? '-' : '+'}
          </span>
        )}
        {file.name}
      </div>
      {expanded && (
        <ul className="list-none pl-4">
          {children.map((child, index) => (
            <FileTree key={index} file={child} selectedFiles={selectedFiles} onSelection={onSelection} fetchFiles={fetchFiles} />
          ))}
        </ul>
      )}
    </li>
  );
};
