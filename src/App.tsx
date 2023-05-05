import { useEffect, useReducer, useMemo, useCallback } from 'react';
import { sortFilesBySelection, getFileExtensions } from './utils';
import { fetchAllFiles, fetchBranches } from './api';
import {
  RepositoryInput,
  Result,
  Branches,
  Loading,
  NoRepositorySelected,
  FileList,
  LastCommit,
  FileFilter,
  Header,
} from './components';
import { reducer, initialState } from './stateReducer';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    files,
    repo,
    isLoadingRepoFiles,
    isLoadingFileContents,
    isLoadingRepoBranches,
    selectedBranch,
    branches,
    selectedExtensions,
    searchQuery,
    fileExtensions,
  } = state;

  const fetchRepoBranches = useCallback(
    async (repo: string) => {
      try {
        dispatch({ type: 'SET_IS_LOADING_REPO_BRANCHES', payload: true });
        const branches = await fetchBranches(repo).then((branches) =>
          branches.sort((a, b) => {
            // Sorting branches so that 'main' or 'master' always comes first
            if (a.name === 'main' || a.name === 'master') return -1;
            if (b.name === 'main' || b.name === 'master') return 1;
            return a.name.localeCompare(b.name);
          })
        );
        dispatch({ type: 'SET_BRANCHES', payload: branches });
        dispatch({
          type: 'SET_SELECTED_BRANCH',
          payload: selectedBranch ? selectedBranch : branches[0].name,
        });
      } catch (error) {
        console.error('Failed to fetch repository branches', error);
        alert('Failed to fetch repository branches');
      } finally {
        dispatch({ type: 'SET_IS_LOADING_REPO_BRANCHES', payload: false });
      }
    },
    [selectedBranch]
  );

  useEffect(() => {
    if (repo) {
      fetchRepoBranches(repo);
      // Refetching branches every 6 seconds
      const interval = setInterval(async () => {
        await fetchBranches(repo)
          .then((branches) =>
            branches.sort((a, b) => {
              // Sorting branches so that 'main' or 'master' always comes first
              if (a.name === 'main' || a.name === 'master') return -1;
              if (b.name === 'main' || b.name === 'master') return 1;
              return a.name.localeCompare(b.name);
            })
          )
          .then((branches) => {
            dispatch({ type: 'SET_BRANCHES', payload: branches });
          });
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [fetchRepoBranches, repo]);

  useEffect(() => {
    let isCancelled = false;

    const fetchBranchFiles = async () => {
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
          console.error('Failed to fetch repository files', error);
          alert('Failed to fetch repository files');
          dispatch({ type: 'SET_IS_LOADING_REPO_FILES', payload: false });
        }
      }
    };

    if (repo && selectedBranch) {
      fetchBranchFiles();
    }

    return () => {
      isCancelled = true;
      dispatch({ type: 'SET_IS_LOADING_REPO_FILES', payload: false });
    };
  }, [repo, selectedBranch]);

  const toggleFileSelect = useCallback((path: string) => {
    dispatch({ type: 'TOGGLE_SELECT_FILE', payload: path });
  }, []);

  const toggleContentCollapse = useCallback((path: string) => {
    dispatch({ type: 'TOGGLE_CONTENT_COLLAPSE', payload: path });
  }, []);

  const resetRepo = useCallback(() => {
    dispatch({ type: 'RESET_REPO' });
  }, []);

  const setRepo = useCallback((repo: string) => {
    dispatch({ type: 'RESET_REPO' });
    dispatch({ type: 'SET_REPO', payload: repo });
  }, []);

  const selectBranch = useCallback((branch: string) => {
    dispatch({ type: 'SET_SELECTED_BRANCH', payload: branch });
  }, []);

  const selectFileExtensions = useCallback(
    (extension: string) => {
      const payload = selectedExtensions.includes(extension)
        ? selectedExtensions.filter((ext) => ext !== extension)
        : [...selectedExtensions, extension];

      dispatch({
        type: 'SET_SELECTED_FILE_EXTENSIONS',
        payload,
      });
    },
    [selectedExtensions]
  );

  const setSearchQuery = useCallback((extension: string) => {
    dispatch({
      type: 'SET_SEARCH_QUERY',
      payload: extension,
    });
  }, []);

  const clearFileFilters = useCallback(() => {
    dispatch({
      type: 'SET_SELECTED_FILE_EXTENSIONS',
      payload: [],
    });
    dispatch({
      type: 'SET_SEARCH_QUERY',
      payload: '',
    });
  }, []);

  const clearFiles = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTED_FILES' });
  }, []);

  const setContentsLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: 'SET_IS_LOADING_FILE_CONTENTS', payload: isLoading });
  }, []);

  const selectedBranchItem = branches.find(
    (branch) => branch.name === selectedBranch
  );

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

  const selectedFiles = useMemo(() => {
    return files.filter((file) => file.isSelected);
  }, [files]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="p-4">
        <div className="container mx-auto">
          <div>
            <RepositoryInput setRepo={setRepo} resetRepo={resetRepo} />
            {isLoadingRepoBranches && <Loading />}
            {!isLoadingRepoBranches && branches && (
              <Branches
                branches={branches}
                selectedBranch={selectedBranch}
                selectBranch={selectBranch}
              />
            )}
            {!isLoadingRepoBranches && selectedBranchItem && (
              <>
                <LastCommit
                  commit={selectedBranchItem.lastCommit}
                  repo={repo}
                />
                <FileFilter
                  value={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedExtensions={selectedExtensions}
                  selectFileExtensions={selectFileExtensions}
                  extensions={fileExtensions}
                  clearFileFilters={clearFileFilters}
                />
              </>
            )}
            {!isLoadingRepoBranches && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  {isLoadingRepoFiles ? (
                    <Loading />
                  ) : repo ? (
                    <FileList
                      files={displayedFiles}
                      toggleFileSelect={toggleFileSelect}
                    />
                  ) : (
                    <NoRepositorySelected />
                  )}
                </div>
                {repo && (
                  <div className="md:col-span-2 min-h-[100vh]">
                    <div className="bg-white dark:bg-gray-800 shadow p-6 rounded min-h-full">
                      <Result
                        files={selectedFiles}
                        repo={repo}
                        branch={selectedBranch}
                        isLoadingFileContents={isLoadingFileContents}
                        clearFiles={clearFiles}
                        setContentsLoading={setContentsLoading}
                        toggleContentCollapse={toggleContentCollapse}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
