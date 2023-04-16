import React from 'react';

interface LastCommitProps {
  repo: string;
  commit: {
    hash: string;
    message: string;
    timestamp: string;
  };
}

export const LastCommit: React.FC<LastCommitProps> = ({ commit, repo }) => {
  const timestamp = new Date(commit.timestamp).toLocaleString();
  return (
    <div className="flex flex-col mt-4">
      <div className="text-gray-500 text-sm">Last Commit:</div>
      <div className="text-gray-700 font-medium">
        <a href={`https://github.com/${repo}/commit/${commit.hash}`} target="_blank" rel="noopener noreferrer">
          {commit.hash}
        </a>
      </div>
      <div className="text-gray-500 text-sm">{commit.message}</div>
      <div className="text-gray-500 text-sm">{timestamp}</div>
    </div>
  );
};
