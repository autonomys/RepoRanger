import React from 'react';

interface FileSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const FileSearchBar: React.FC<FileSearchBarProps> = ({ value, onChange }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="flex justify-between mb-4 relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        className="border border-gray-300 rounded w-full p-2 my-4"
        placeholder="Search files..."
        aria-label="Search files"
      />
      {value && (
        <button
          type="button"
          className={`${
            value ? 'block' : 'hidden'
          } absolute right-0 top-1/2 transform -translate-y-1/2 px-2 h-full rounded-r ${
            value ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-100'
          }`}
          style={{ height: '2.5rem' }}
          onClick={() => onChange('')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 m-auto"
          >
            <path
              fillRule="evenodd"
              d="M11.414 10l4.293-4.293a1 1 0 10-1.414-1.414L10 8.586l-4.293-4.293a1 1 0 10-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 001.414 1.414L10 11.414l4.293 4.293a1 1 0 001.414-1.414L11.414 10z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
