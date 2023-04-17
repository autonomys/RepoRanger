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
    <div>
      <h2 className="font-semibold mb-2">Selected Files:</h2>
      {selectedFiles.map((path, index) => {
        const file = files.find((f) => f.path === path);
        if (file) {
          const fileContent = selectedFileContents.get(path);
          return (
            <div key={`${file.path}-${index}`} className="mb-6">
              <h3 className="font-semibold mb-2">
                {index + 1}. file: {file.path}
              </h3>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                {fileContent}
              </pre>
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};
