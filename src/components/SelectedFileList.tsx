import { GitHubFile } from '../types';

interface SelectedFileListProps {
  selectedFiles: string[];
  files: GitHubFile[];
  selectedFileContents: Map<string, string>;
}

export const SelectedFileList: React.FC<SelectedFileListProps> = ({
  selectedFiles,
  files,
  selectedFileContents,
}) => {
  return (
    <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
      {selectedFiles.map((path, index) => {
        const file = files.find((f) => f.path === path);
        if (file) {
          const fileContent = selectedFileContents.get(path);
          return (
            <div key={`${file.path}-${index}`}>
              <h3 className="font-semibold">
                {index + 1}. file: {file.path}
              </h3>
              <p>{fileContent}</p>
            </div>
          );
        } else {
          return null;
        }
      })}
    </pre>
  );
};
