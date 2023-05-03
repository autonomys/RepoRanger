import { GitHubFile } from '../../types';

interface FileItemProps {
  file: GitHubFile;
  toggleFileSelect: (path: string) => void;
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  toggleFileSelect,
}) => {
  return (
    <li className="pl-2 py-1">
      <label className="cursor-pointer flex items-center space-x-2">
        <input
          type="checkbox"
          checked={file.isSelected}
          onChange={() => toggleFileSelect(file.path)}
        />
        <span
          className={`truncate w-full ${file.isSelected ? 'font-semibold' : ''} dark:text-gray-300`}
        >
          {file.path}
        </span>
      </label>
    </li>
  );
};
