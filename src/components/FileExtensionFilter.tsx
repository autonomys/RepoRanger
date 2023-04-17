import React from 'react';

interface FileExtensionFilterProps {
  selectedFileExtension: string;
  onSelectExtension: (extension: string) => void;
  extensions: string[];
}

export const FileExtensionFilter: React.FC<FileExtensionFilterProps> = ({
  selectedFileExtension,
  onSelectExtension,
  extensions,
}) => {
  const handleExtensionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onSelectExtension(event.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor="file-extension" className="block mb-2">
        Filter by file type:
      </label>
      <select
        id="file-extension"
        value={selectedFileExtension}
        onChange={handleExtensionChange}
        className="border border-gray-300 rounded p-2"
        aria-label="Filter by file type"
      >
        <option value="">All files</option>
        {extensions.map((extension) => (
          <option key={extension} value={extension}>
            {extension}
          </option>
        ))}
      </select>
    </div>
  );
};
