import { GitHubFile } from '../../types';
import { ChevronDownIcon, ChevronRightIcon } from '../icons';

interface ContentsProps {
  selectedFiles: GitHubFile[];
  selectedFileContents: Map<string, string>;
  handleFileCollapse: (path: string) => void;
}

export const Contents: React.FC<ContentsProps> = ({
  selectedFiles,
  selectedFileContents,
  handleFileCollapse,
}) => {
  return (
    <div>
      <h2 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Selected Files:</h2>
      {selectedFiles.map(({ path, isCollapsed }, index) => {
        const fileContent = selectedFileContents.get(path);
        return (
          <div key={`${path}-${index}`} className="mb-6">
            <div className="flex align-center mb-2 text-gray-800 dark:text-gray-200">
              <button onClick={() => handleFileCollapse(path)}>
                {isCollapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}
              </button>
              <h3 className="text-gray-800 dark:text-gray-200">{path}</h3>
            </div>
            <div style={{ display: isCollapsed ? 'none' : 'block' }}>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-x-auto text-gray-800 dark:text-gray-200">
                {fileContent}
              </pre>
            </div>
          </div>
        );
      })}
    </div>
  );
};
