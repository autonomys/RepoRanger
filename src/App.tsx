import { useEffect, useReducer, useMemo } from 'react';
import {
  getSelectedFiles,
  sortFilesBySelection,
  getFileExtensions,
} from './utils';
import { fetchAllFiles, fetchBranches } from './api';
import { GitHubFile } from './types';
import {
  RepositoryInput,
  SelectedFiles,
  BranchSelector,
  Loading,
  NoRepositorySelected,
  FileList,
  LastCommit,
  FileSearchAndFilter,
} from './components';

interface State {
  files: GitHubFile[];
  selectedFiles: Set<string>;
  repo: string;
  isLoadingRepoFiles: boolean;
  isLoadingFileContents: boolean;
  selectedBranch: string;
  branches: {
    name: string;
    lastCommit: { hash: string; message: string; timestamp: string };
  }[];
  searchQuery: string;
  fileExtensions: string[];
  selectedExtensions: string[];
}

export type Action =
  | { type: 'RESET' }
  | { type: 'SET_FILES'; payload: GitHubFile[] }
  | { type: 'SET_SELECTED_FILES'; payload: Set<string> }
  | { type: 'SET_REPO'; payload: string }
  | { type: 'SET_IS_LOADING_REPO_FILES'; payload: boolean }
  | { type: 'SET_IS_LOADING_FILE_CONTENTS'; payload: boolean }
  | { type: 'SET_SELECTED_BRANCH'; payload: string }
  | {
      type: 'SET_BRANCHES';
      payload: Array<{
        name: string;
        lastCommit: { hash: string; message: string; timestamp: string };
      }>;
    }
  | { type: 'SET_SELECTED_FILE_EXTENSION'; payload: string[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILE_EXTENSIONS'; payload: string[] }
  | { type: 'CLEAR_SELECTED_FILES' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_FILES':
      return { ...state, files: action.payload };
    case 'SET_SELECTED_FILES':
      return { ...state, selectedFiles: action.payload };
    case 'SET_REPO':
      return { ...state, repo: action.payload };
    case 'SET_IS_LOADING_REPO_FILES':
      return { ...state, isLoadingRepoFiles: action.payload };
    case 'SET_IS_LOADING_FILE_CONTENTS':
      return { ...state, isLoadingFileContents: action.payload };
    case 'SET_SELECTED_BRANCH':
      return { ...state, selectedBranch: action.payload };
    case 'SET_BRANCHES':
      return { ...state, branches: action.payload };
    case 'RESET':
      return { ...initialState };
    case 'SET_SELECTED_FILE_EXTENSION':
      return {
        ...state,
        selectedExtensions: action.payload,
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    case 'SET_FILE_EXTENSIONS':
      return {
        ...state,
        fileExtensions: action.payload,
      };
    case 'CLEAR_SELECTED_FILES':
      return { ...state, selectedFiles: new Set() };
    default:
      return state;
  }
};

const initialState: State = {
  files: [],
  selectedFiles: new Set(),
  repo: '',
  isLoadingRepoFiles: false,
  isLoadingFileContents: false,
  selectedBranch: '',
  branches: [],
  selectedExtensions: [],
  searchQuery: '',
  fileExtensions: [],
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    files,
    selectedFiles,
    repo,
    isLoadingRepoFiles,
    selectedBranch,
    branches,
    isLoadingFileContents,
    selectedExtensions,
    searchQuery,
    fileExtensions,
  } = state;

  useEffect(() => {
    dispatch({ type: 'SET_SELECTED_FILES', payload: new Set() });
  }, [repo]);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      if (repo) {
        dispatch({ type: 'SET_IS_LOADING_REPO_FILES', payload: true });
        try {
          const files = await fetchAllFiles(repo, selectedBranch);
          const fileExtensions = getFileExtensions(files);
          if (!isCancelled) {
            dispatch({ type: 'SET_FILES', payload: files });
            dispatch({ type: 'SET_IS_LOADING_REPO_FILES', payload: false });
            dispatch({ type: 'SET_FILE_EXTENSIONS', payload: fileExtensions });
          }
        } catch (error) {
          console.error('Failed to fetch data', error);
          dispatch({ type: 'SET_IS_LOADING_REPO_FILES', payload: false });
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
      dispatch({ type: 'SET_IS_LOADING_REPO_FILES', payload: false });
    };
  }, [repo, selectedBranch]);

  const handleRepoSubmit = async (repo: string) => {
    try {
      const branches = await fetchBranches(repo).then((branches) =>
        branches.sort((a, b) => {
          // Sorting branches so that 'main' or 'master' always comes first
          if (a.name === 'main' || a.name === 'master') return -1;
          if (b.name === 'main' || b.name === 'master') return 1;
          return a.name.localeCompare(b.name);
        })
      );

      dispatch({ type: 'SET_BRANCHES', payload: branches });
      dispatch({ type: 'SET_SELECTED_BRANCH', payload: branches[0].name });
      dispatch({ type: 'SET_REPO', payload: repo });
    } catch (error) {
      alert('Failed to fetch repository branches');
    }
  };

  const handleSelection = (file: GitHubFile) => {
    const files = getSelectedFiles(selectedFiles, file);
    dispatch({
      type: 'SET_SELECTED_FILES',
      payload: files,
    });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  const selectedBranchItem = branches.find(
    (branch) => branch.name === selectedBranch
  );

  const handleBranchSelect = (branch: string) => {
    dispatch({ type: 'SET_SELECTED_BRANCH', payload: branch });
  };

  const handleSelectFileExtension = (extension: string) => {
    if (selectedExtensions.includes(extension)) {
      dispatch({
        type: 'SET_SELECTED_FILE_EXTENSION',
        payload: selectedExtensions.filter((ext) => ext !== extension),
      });
    } else {
      dispatch({
        type: 'SET_SELECTED_FILE_EXTENSION',
        payload: [...selectedExtensions, extension],
      });
    }
  };

  const handleSearchQuery = (extension: string) => {
    dispatch({
      type: 'SET_SEARCH_QUERY',
      payload: extension,
    });
  };

  const displayedFiles = useMemo(() => {
    let filesToDisplay = files;

    if (selectedExtensions.length > 0) {
      filesToDisplay = files.filter((file) =>
        selectedExtensions.some((ext) => file.path.endsWith(`.${ext}`))
      );
    }

    return sortFilesBySelection(filesToDisplay, selectedFiles).filter((file) =>
      file.path
        .toLowerCase()
        .includes(searchQuery ? searchQuery.toLowerCase() : '')
    );
  }, [files, selectedExtensions, selectedFiles, searchQuery]);

  const handleClear = () => {
    dispatch({
      type: 'SET_SELECTED_FILE_EXTENSION',
      payload: [],
    });
    dispatch({
      type: 'SET_SEARCH_QUERY',
      payload: '',
    });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white text-xl p-4 font-semibold">
        RepoRanger
      </header>
      <main className="p-4">
        <div className="container mx-auto">
          <div>
            <RepositoryInput
              onSubmit={handleRepoSubmit}
              onReset={handleReset}
            />
            {repo && (
              <BranchSelector
                branches={branches}
                selectedBranch={selectedBranch}
                onBranchChange={handleBranchSelect}
              />
            )}
            {selectedBranchItem && (
              <>
                <LastCommit
                  commit={selectedBranchItem.lastCommit}
                  repo={repo}
                />
                <FileSearchAndFilter
                  value={searchQuery}
                  onChange={handleSearchQuery}
                  selectedExtensions={selectedExtensions}
                  onSelectExtension={handleSelectFileExtension}
                  extensions={fileExtensions}
                  onClear={handleClear}
                />
              </>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                {isLoadingRepoFiles ? (
                  <Loading />
                ) : repo ? (
                  <FileList
                    files={displayedFiles}
                    selectedFiles={selectedFiles}
                    handleSelection={handleSelection}
                  />
                ) : (
                  <NoRepositorySelected />
                )}
              </div>
              {repo && (
                <div className="md:col-span-2 min-h-[50vh]">
                  <div className="bg-white shadow p-6 rounded min-h-full">
                    <SelectedFiles
                      selectedFiles={selectedFiles}
                      files={files}
                      repo={repo}
                      branch={selectedBranch}
                      dispatch={dispatch}
                      isLoadingFileContents={isLoadingFileContents}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
