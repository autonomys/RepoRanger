// src/GitHubRepositoryInput.tsx
import React, { useState } from 'react';

interface GitHubRepositoryInputProps {
  onSubmit: (repo: string) => void;
}

export const GitHubRepositoryInput: React.FC<GitHubRepositoryInputProps> = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const repoMatch = inputValue.match(/github.com\/(.+\/.+)(\/|$)/i);
    if (repoMatch && repoMatch[1]) {
      onSubmit(repoMatch[1]);
    } else {
      alert('Invalid GitHub repository URL.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <label htmlFor="repo-url" className="block mb-2">
        GitHub Repository URL:
      </label>
      <input
        type="text"
        id="repo-url"
        value={inputValue}
        onChange={handleInputChange}
        className="border border-gray-300 rounded w-full p-2"
        placeholder="https://github.com/owner/repo"
      />
    </form>
  );
};
