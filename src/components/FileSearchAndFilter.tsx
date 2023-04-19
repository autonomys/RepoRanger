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
      <div className='flex items-start gap-2'>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          className="border border-gray-300 rounded md:w-2/3 lg:w-1/3 w-full p-2 mb-4"
          placeholder="Search files..."
          aria-label="Search files"
        />
        {selectedExtensions.length || value ? (
          <Button variant="danger" onClick={onClear}>
            Clear
          </Button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-4">
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
