import { GitHubFile } from '../../types';

interface FileItemProps {
  file: GitHubFile;
  handleSelection: (path: string) => void;
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  handleSelection,
}) => {
  return (
    <li className="pl-2 py-1">
      <label className="cursor-pointer flex items-center space-x-2">
        <input
          type="checkbox"
          checked={file.isSelected}
          onChange={() => handleSelection(file.path)}
          className="form-checkbox text-blue-500"
        />
        <span
          className={`truncate w-full ${file.isSelected ? 'font-semibold' : ''}`}
        >
          {file.path}
        </span>
      </label>
    </li>
  );
};
