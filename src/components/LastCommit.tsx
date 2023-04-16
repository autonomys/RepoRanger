import React from 'react';

interface LastCommitProps {
  commit: {
    hash: string;
    message: string;
    timestamp: string;
  };
}

export const LastCommit: React.FC<LastCommitProps> = ({ commit }) => {
  const timestamp = new Date(commit.timestamp).toLocaleString();
  return (
    <div className="last-commit-container mt-6 mb-4">
      <div className="text-gray-500 text-sm">Last Commit:</div>
      <div className="text-gray-700 font-medium text-sm md:text-base">
        {commit.hash}
      </div>
      <div className="text-gray-500 text-sm">{commit.message}</div>
      <div className="text-gray-500 text-sm">{timestamp}</div>
    </div>
  );
};
