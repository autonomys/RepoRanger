import { FC, createContext, useContext, ReactNode, useState } from 'react';

import { useFiles, useFileFilter, useResult, useBranches } from './hooks';
import { Notification as INotification } from './types';

type State = any;
// {
//   isLoadingRepoBranches: 
//   branches: 
//   selectedBranch: 
//   loadRepoBranchesError: 
//   selectBranch: 
//   lastCommit: 
//   fetchRepoBranches: 
//   isLoadingRepoFiles: 
//   files: 
//   fileExtensions: 
//   loadRepoFilesError: 
//   toggleFileSelect: 
//   selectedFiles: 
//   toggleContentCollapse: 
//   clearSelectedFiles: 
//   searchQuery: 
//   setSearchQuery: 
//   selectedExtensions: 
//   selectFileExtensions: 
//   clearFileFilters: 
//   displayedFiles: 
//   isLoadingFileContents: 
//   totalCharCount: 
//   handleCopy: 
//   handleDownload: 
//   selectedFileContents: 
//   repoName: 
//   setRepoName: 
//   notification: 
//   setNotification: 
// };

const AppStateContext = createContext<State>(
  {}
);

type Props = {
  children?: ReactNode;
};

export const AppStateProvider: FC<Props> = ({ children }) => {
  const [repoName, setRepoName] = useState<string>('');
  const [notification, setNotification] = useState<INotification | null>(null);

  const {
    isLoadingRepoBranches,
    branches,
    selectedBranch,
    loadRepoBranchesError,
    selectBranch,
    lastCommit,
    fetchRepoBranches,
  } = useBranches(repoName, setNotification);

  const {
    isLoadingRepoFiles,
    files,
    fileExtensions,
    loadRepoFilesError,
    toggleFileSelect,
    selectedFiles,
    toggleContentCollapse,
    clearSelectedFiles,
  } = useFiles(repoName, selectedBranch?.name, lastCommit, setNotification);

  const {
    searchQuery,
    setSearchQuery,
    selectedExtensions,
    selectFileExtensions,
    clearFileFilters,
    displayedFiles,
  } = useFileFilter(files);

  const {
    isLoadingFileContents,
    totalCharCount,
    handleCopy,
    handleDownload,
    selectedFileContents,
  } = useResult(
    selectedFiles,
    repoName,
    selectedBranch?.name!,
    setNotification
  );

  return (
    <AppStateContext.Provider
      value={{
        isLoadingRepoBranches,
        branches,
        selectedBranch,
        loadRepoBranchesError,
        selectBranch,
        lastCommit,
        fetchRepoBranches,
        isLoadingRepoFiles,
        files,
        fileExtensions,
        loadRepoFilesError,
        toggleFileSelect,
        selectedFiles,
        toggleContentCollapse,
        clearSelectedFiles,
        searchQuery,
        setSearchQuery,
        selectedExtensions,
        selectFileExtensions,
        clearFileFilters,
        displayedFiles,
        isLoadingFileContents,
        totalCharCount,
        handleCopy,
        handleDownload,
        selectedFileContents,
        repoName,
        setRepoName,
        notification,
        setNotification,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): State => {
  const context = useContext(AppStateContext);

  if (!context)
    throw new Error('AppStateContext must be used within AppStateProvider');

  return context;
};
