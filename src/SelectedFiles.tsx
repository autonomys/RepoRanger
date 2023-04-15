import React from 'react';
import { GitHubFile } from './types';

export const SelectedFiles: React.FC<{
  selectedFiles: Set<string>;
  files: GitHubFile[];
}> = ({ selectedFiles, files }) => {
  return (
    <div>
      <h2>Selected Files:</h2>
      <pre>
        {[...selectedFiles].map((path, index) => {
          const file = files.find((f) => f.path === path);
          if (file) {
            return (
              <div key={path}>
                <h3>
                  {index + 1}. file: {file.path}
                </h3>
                <p>contents of {file.name}</p>
              </div>
            );
          } else {
            return null;
          }
        })}
      </pre>
    </div>
  );
};
