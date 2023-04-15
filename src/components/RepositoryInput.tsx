import React, { useState } from 'react';

interface RepositoryInputProps {
  onSubmit: (repo: string) => void;
}

export const RepositoryInput: React.FC<RepositoryInputProps> = ({
  onSubmit,
}) => {
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
      <div className="flex items-stretch">
        <input
          type="text"
          id="repo-url"
          value={inputValue}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-l w-full p-2"
          placeholder="https://github.com/owner/repo"
          aria-label="GitHub Repository URL"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
        >
          Load Repository
        </button>
      </div>
    </form>
  );
};
