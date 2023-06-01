import { FC, createContext, useContext, ReactNode, useState } from 'react';

import {
  useFiles,
  useFileFilter,
  useResult,
  useBranches,
  useLangchain,
} from './hooks';
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

const AppStateContext = createContext<State>({});

type Props = {
  children?: ReactNode;
};

export const AppStateProvider: FC<Props> = ({ children }) => {
  const [repoName, setRepoName] = useState<string>('');
  const [notification, setNotification] = useState<INotification | null>(null);

  const branchesState = useBranches(repoName, setNotification);
  const filesState = useFiles(
    repoName,
    branchesState.selectedBranch?.name,
    branchesState.lastCommit,
    setNotification
  );
  const fileFilterState = useFileFilter(filesState.files);
  const resultState = useResult(
    filesState.selectedFiles,
    repoName,
    branchesState.selectedBranch?.name!,
    setNotification
  );
  const langChainState = useLangchain(setNotification);

  return (
    <AppStateContext.Provider
      value={{
        ...branchesState,
        ...filesState,
        ...fileFilterState,
        ...resultState,
        ...langChainState,
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
