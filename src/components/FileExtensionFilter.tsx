import React from 'react';

interface FileExtensionFilterProps {
  selectedFileExtension: string;
  onSelectExtension: (extension: string) => void;
}

export const FileExtensionFilter: React.FC<FileExtensionFilterProps> = ({
  selectedFileExtension,
  onSelectExtension,
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
        <option value=".js">JavaScript (.js)</option>
        <option value=".ts">TypeScript (.ts)</option>
        <option value=".jsx">React JavaScript (.jsx)</option>
        <option value=".tsx">React TypeScript (.tsx)</option>
        <option value=".json">JSON (.json)</option>
        <option value=".md">Markdown (.md)</option>
        <option value=".txt">Text (.txt)</option>
        {/* Add more file types as needed */}
      </select>
    </div>
  );
};
