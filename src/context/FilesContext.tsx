import {
  createContext,
  useContext,
  useState,
  FC,
  ReactNode,
  useEffect,
  useMemo,
} from 'react';
import { GitHubFile } from '../types';
import { fetchAllFiles } from '../api';
import { getFileExtensions, sortFilesBySelection } from '../utils';
import { useBranches } from './BranchContext';
import { useRepo } from './RepoContext';
import { useNotification } from './NotificationContext';

type FilesState = {
  files: GitHubFile[];
  fileExtensions: string[];
  isLoadingRepoFiles: boolean;
  loadRepoFilesError: string | null;
  selectedFiles: GitHubFile[];
  toggleFileSelect: (filePath: string) => void;
  toggleContentCollapse: (filePath: string) => void;
  clearSelectedFiles: () => void;
  selectFileExtensions: (fileExtension: string) => void;
  clearFileFilters: () => void;
  displayedFiles: GitHubFile[];
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  selectedExtensions: string[];
};

const initialFilesState: FilesState = {
  files: [],
  fileExtensions: [],
  isLoadingRepoFiles: false,
  loadRepoFilesError: null,
  selectedFiles: [],
  toggleFileSelect: () => {},
  toggleContentCollapse: () => {},
  clearSelectedFiles: () => {},
  selectFileExtensions: () => {},
  clearFileFilters: () => {},
  displayedFiles: [],
  searchQuery: '',
  setSearchQuery: () => {},
  selectedExtensions: [],
};

const FilesContext = createContext<FilesState>(initialFilesState);

type Props = {
  children: ReactNode;
};

export const FilesProvider: FC<Props> = ({ children }) => {
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [fileExtensions, setFileExtensions] = useState<string[]>([]);
  const [isLoadingRepoFiles, setIsLoadingRepoFiles] = useState(false);
  const [loadRepoFilesError, setLoadRepoFilesError] = useState<null | string>(
    null
  );

  const { selectedBranchName } = useBranches();
  const { repoName } = useRepo();
  const { setNotification } = useNotification();

  useEffect(() => {
    let isCancelled = false;

    const fetchBranchFiles = async () => {
      setLoadRepoFilesError(null);
      if (repoName && selectedBranchName) {
        setIsLoadingRepoFiles(true);
        try {
          const files = await fetchAllFiles(repoName, selectedBranchName);
          const fileExtensions = getFileExtensions(files);

          if (!isCancelled) {
            setFiles(files);
            setFileExtensions(fileExtensions);
          }
        } catch (error) {
          const errorMessage = 'Failed to fetch repository files';
          console.error(errorMessage, error);
          setLoadRepoFilesError(errorMessage);
          setNotification({
            message: errorMessage,
            type: 'error',
          });
        } finally {
          setIsLoadingRepoFiles(false);
        }
      }
    };

    if (repoName && selectedBranchName) {
      fetchBranchFiles();
    }

    return () => {
      isCancelled = true;
      setIsLoadingRepoFiles(false);
    };
  }, [loadRepoFilesError, repoName, selectedBranchName, setNotification]);

  const toggleFileSelect = (filePath: string) => {
    setFiles((files) =>
      files.map((file) => {
        if (file.path === filePath) {
          return {
            ...file,
            isSelected: !file.isSelected,
            isCollapsed: file.isSelected ? file.isCollapsed : false,
          };
        }
        return file;
      })
    );
  };

  const clearSelectedFiles = () => {
    setFiles((files) =>
      files.map((file) => ({ ...file, isSelected: false, isCollapsed: false }))
    );
  };

  const selectedFiles = useMemo(() => {
    return files.filter((file) => file.isSelected);
  }, [files]);

  const toggleContentCollapse = (filePath: string) => {
    setFiles((files) =>
      files.map((file) => {
        if (file.path === filePath) {
          return { ...file, isCollapsed: !file.isCollapsed };
        }
        return file;
      })
    );
  };

  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectFileExtensions = (extension: string) => {
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

  const value = {
    files,
    fileExtensions,
    isLoadingRepoFiles,
    loadRepoFilesError,
    toggleFileSelect,
    selectedFiles,
    toggleContentCollapse,
    clearSelectedFiles,
    selectFileExtensions,
    clearFileFilters,
    displayedFiles,
    searchQuery,
    setSearchQuery,
    selectedExtensions,
  };

  return (
    <FilesContext.Provider value={value}>{children}</FilesContext.Provider>
  );
};

export const useFiles = () => useContext(FilesContext);
