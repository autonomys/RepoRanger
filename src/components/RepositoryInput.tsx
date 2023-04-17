import React, { useState } from 'react';
import { Button } from './Button';

interface RepositoryInputProps {
  onSubmit: (repo: string) => void;
  onReset: () => void;
}

export const RepositoryInput: React.FC<RepositoryInputProps> = ({
  onSubmit,
  onReset,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    const repoMatch = inputValue.match(/github.com\/(.+\/.+)(\/|$)/i);
    if (repoMatch && repoMatch[1]) {
      onSubmit(repoMatch[1]);
    } else {
      alert('Invalid GitHub repository URL.');
    }
  };

  const handleReset = () => {
    setInputValue('');
    onReset();
  };

  return (
    <div className="mb-4">
      <label htmlFor="repo-url" className="block mb-2">
        GitHub Repository URL:
      </label>
      <div className="flex items-stretch gap-4">
        <input
          type="text"
          id="repo-url"
          value={inputValue}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-l w-full p-2"
          placeholder="https://github.com/owner/repo"
          aria-label="GitHub Repository URL"
        />
        <Button onClick={handleSubmit} className="rounded-r">
          Load Repository
        </Button>
        {inputValue && (
          <Button onClick={handleReset} variant="danger" className="ml-2">
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};
