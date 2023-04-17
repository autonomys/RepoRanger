import { Button } from './Button';

interface FileSearchAndFilterProps {
  selectedExtensions: string[];
  onSelectExtension: (extension: string) => void;
  extensions: string[];
  onClear: () => void;
  value: string;
  onChange: (value: string) => void;
}

export const FileSearchAndFilter: React.FC<FileSearchAndFilterProps> = ({
  selectedExtensions,
  onSelectExtension,
  extensions,
  onClear,
  value,
  onChange,
}) => {
  const handleExtensionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onSelectExtension(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="mb-4">
      <div className='flex items-start gap-4'>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          className="border border-gray-300 rounded w-full p-2 mb-4"
          placeholder="Search files..."
          aria-label="Search files"
        />
        {selectedExtensions.length || value ? (
          <Button variant="danger" onClick={onClear}>
            Clear
          </Button>
        ) : null}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11 gap-1">
        {extensions.map((extension) => (
          <label key={extension} className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              value={extension}
              checked={selectedExtensions.includes(extension)}
              onChange={handleExtensionChange}
              aria-label={`Filter by ${extension} file type`}
            />
            <span className="ml-2">{extension}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
