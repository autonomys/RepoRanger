import { memo } from 'react';
import { FileItem } from './FileItem';
import { GitHubFile } from '../../types';

interface FileListProps {
  files: GitHubFile[];
  toggleFileSelect: (path: string) => void;
}

export const FileList: React.FC<FileListProps> = memo(
  ({ files, toggleFileSelect }) => {
    return (
      <div className="bg-white shadow p-6 rounded min-h-full">
        <h2 className="font-semibold mb-4">Files:</h2>
        <ul className="list-none">
          {files.map((file, index) => (
            <FileItem
              key={`${file.path}-${index}`}
              file={file}
              toggleFileSelect={toggleFileSelect}
            />
          ))}
        </ul>
      </div>
    );
  }
);
