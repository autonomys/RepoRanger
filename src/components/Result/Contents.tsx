import { GitHubFile } from '../../types';
import { ChevronDownIcon, ChevronRightIcon } from '../icons';

interface ContentsProps {
  selectedFiles: string[];
  files: GitHubFile[];
  selectedFileContents: Map<string, string>;
  collapsedFiles: Set<string>;
  handleFileCollapse: (path: string) => void;
}

export const Contents: React.FC<ContentsProps> = ({
  selectedFiles,
  files,
  selectedFileContents,
  collapsedFiles,
  handleFileCollapse,
}) => {
  return (
    <div>
      <h2 className="font-semibold mb-2">Selected Files:</h2>
      {selectedFiles.map((path, index) => {
        const file = files.find((f) => f.path === path);
        if (file) {
          const fileContent = selectedFileContents.get(path);
          const isCollapsed = collapsedFiles.has(path);
          return (
            <div key={`${file.path}-${index}`} className="mb-6">
              <div className="flex align-center mb-2">
                <button onClick={() => handleFileCollapse(path)}>
                  {isCollapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}
                </button>
                <h3>{file.path}</h3>
              </div>
              <div style={{ display: isCollapsed ? 'none' : 'block' }}>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                  {fileContent}
                </pre>
              </div>
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};
