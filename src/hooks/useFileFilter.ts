import { useState, useMemo } from 'react';
import { GitHubFile } from '../types';
import { sortFilesBySelection } from '../utils';

export function useFileFilter(files: GitHubFile[]) {
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectFileExtensions =
    (extension: string) => {
      const extensions = selectedExtensions.includes(extension)
        ? selectedExtensions.filter((ext) => ext !== extension)
        : [...selectedExtensions, extension];

      setSelectedExtensions(extensions);
    };

  const clearFileFilters = () => {
    setSelectedExtensions([]);
    setSearchQuery('');
  };

  const displayedFiles = useMemo(() => {
    let filesToDisplay = files;

    if (selectedExtensions.length > 0) {
      filesToDisplay = files.filter((file) =>
        selectedExtensions.some((ext) => file.path.endsWith(`.${ext}`))
      );
    }

    return sortFilesBySelection(filesToDisplay).filter((file) =>
      file.path
        .toLowerCase()
        .includes(searchQuery ? searchQuery.toLowerCase() : '')
    );
  }, [files, selectedExtensions, searchQuery]);

  return {
    selectFileExtensions,
    setSearchQuery,
    searchQuery,
    clearFileFilters,
    selectedExtensions,
    displayedFiles,
  };
}
