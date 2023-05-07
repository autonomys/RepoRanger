import { useCallback, useState } from 'react';
import { Button } from './Button';

interface RepositoryInputProps {
  setRepo: (repo: string) => void;
  resetRepo: () => void;
}

export const RepositoryInput: React.FC<RepositoryInputProps> = ({
  setRepo,
  resetRepo,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError('');
  };

  const handleSubmit = useCallback(() => {
    const repoMatch = inputValue.match(/github.com\/(.+\/.+)(\/|$)/i);
    if (repoMatch && repoMatch[1]) {
      setRepo(repoMatch[1]);
      setError('');
    } else {
      setError('Invalid GitHub repository URL');
    }
  }, [inputValue, setRepo]);

  const handleResetClick = useCallback(() => {
    setInputValue('');
    setError('');
    resetRepo();
  }, [resetRepo]);

  return (
    <div className="mb-4 text-gray-700 dark:text-gray-300">
      <label htmlFor="repo-url" className="block mb-2">
        GitHub Repository URL:
      </label>
      <div className="flex items-stretch gap-2">
        <input
          type="text"
          id="repo-url"
          value={inputValue}
          onChange={handleInputChange}
          className={`border ${
            error ? 'border-red-600' : 'border-gray-300 dark:border-gray-700'
          } rounded md:w-2/3 lg:w-1/3 w-full p-2`}
          placeholder="https://github.com/owner/repo"
          aria-label="GitHub Repository URL"
        />
        <Button onClick={handleSubmit} className="rounded-r">
          Load
        </Button>
        {inputValue && (
          <Button onClick={handleResetClick} variant="danger" className="ml-2">
            Reset
          </Button>
        )}
      </div>
      <div className="mt-2" style={{ minHeight: '1.5em' }}>
        {error && <p className="text-red-600 m-0">{error}</p>}
      </div>
    </div>
  );
};
