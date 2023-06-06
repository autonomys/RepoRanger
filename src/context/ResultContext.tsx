import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  FC,
  ReactNode,
} from 'react';
import { fetchFileContent } from '../api';
import { useFiles } from './FilesContext';
import { useRepo } from './RepoContext';
import { useBranches } from './BranchContext';
import { useNotification } from './NotificationContext';

type ResultState = {
  isLoadingFileContents: boolean;
  setContentsLoading: (isLoading: boolean) => void;
  totalCharCount: number;
  loadFileContentsError: null | string;
  handleDownload: () => void;
  handleCopy: () => void;
  selectedFileContents: Map<string, string>;
  fileContent: string;
};

const initialResultState: ResultState = {
  isLoadingFileContents: false,
  setContentsLoading: () => {},
  totalCharCount: 0,
  loadFileContentsError: null,
  handleDownload: () => {},
  handleCopy: () => {},
  selectedFileContents: new Map(),
  fileContent: '',
};

const ResultContext = createContext<ResultState>(initialResultState);

type Props = {
  children: ReactNode;
};

export const ResultProvider: FC<Props> = ({ children }) => {
  const { selectedFiles } = useFiles();
  const { repoName } = useRepo();
  const { selectedBranchName } = useBranches();
  const [isLoadingFileContents, setContentsLoading] = useState(false);
  const [loadFileContentsError, setLoadFileContentsError] = useState<
    null | string
  >(null);

  const { setNotification } = useNotification();

  const [selectedFileContents, setSelectedFileContents] = useState<
    Map<string, string>
  >(new Map());

  const totalCharCount = useMemo(() => {
    let totalChars = 0;
    selectedFileContents.forEach((content) => {
      totalChars += content.length;
    });
    return totalChars;
  }, [selectedFileContents]);

  
  useEffect(() => {
    const abortController = new AbortController();
    
    if (selectedFiles.length === 0) {
      setSelectedFileContents(new Map());
      return;
    }
    
    const newSelectedFileContents = new Map(
      [...selectedFiles].map(({ path }) => [path, ''])
      );

    if (repoName && selectedBranchName) {
      setContentsLoading(true);

      const promises = selectedFiles.map(({ path }) => {
        setLoadFileContentsError(null);
        return fetchFileContent(
          repoName,
          selectedBranchName!,
          path,
          abortController.signal
        )
          .then(({ content }) => {
            newSelectedFileContents.set(path, content || '');
          })
          .catch((error) => {
            const errorMessage = `Error fetching file content for ${path}`;
            console.error(`${errorMessage}:`, error);
            setLoadFileContentsError(errorMessage);
            setNotification({
              message: errorMessage,
              type: 'error',
            });
          });
      });

      Promise.all(promises).then(() => {
        setSelectedFileContents(newSelectedFileContents);
        setContentsLoading(false);
      });
    }

    return () => {
      abortController.abort();
    };
  }, [repoName, setContentsLoading, selectedBranchName, setNotification, selectedFiles, totalCharCount]);

  const fileContent = [...selectedFileContents.values()].join('\n\n');

  const handleDownload = () => {
    const blob = new Blob([fileContent], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${repoName}-${selectedBranchName}-selected-files.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent).then(() => {
      setNotification({
        message: 'Contents copied to clipboard.',
        type: 'success',
      });
    });
  };

  const value = {
    isLoadingFileContents,
    setContentsLoading,
    totalCharCount,
    loadFileContentsError,
    handleDownload,
    handleCopy,
    selectedFileContents,
    fileContent,
  };

  return (
    <ResultContext.Provider value={value}>{children}</ResultContext.Provider>
  );
};

export const useResult = () => useContext(ResultContext);
