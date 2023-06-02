import {
  RepositoryInput,
  Result,
  Branches,
  Loading,
  NoRepositorySelected,
  FileList,
  LastCommit,
  FileFilter,
} from './components';
import { useNotification } from './context/NotificationContext';
import { useBranches } from './context/BranchContext';
import { useRepo } from './context/RepoContext';
import { useFiles } from './context/FilesContext';
import { useResult } from './context/ResultContext';

export const Main = () => {
  const { setNotification } = useNotification();

  const {
    branches,
    setSelectedBranchName,
    isLoadingRepoBranches,
    loadRepoBranchesError,
    fetchRepoBranches,
    selectedBranch,
  } = useBranches();

  const { repoName, setRepoName } = useRepo();
  const {
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
  } = useFiles();

  const {
    isLoadingFileContents,
    totalCharCount,
    handleCopy,
    handleDownload,
    selectedFileContents,
  } = useResult();

  const hasErrors = loadRepoBranchesError || loadRepoFilesError;
  const hasBranches = repoName && !hasErrors && branches.length > 0;
  const hasSelectedBranch = repoName && !hasErrors && selectedBranch;
  const hasFiles = repoName && !hasErrors && files.length > 0;

  const setRepo = (repo: string) => {
    setRepoName(repo);
    fetchRepoBranches(repo);
  };

  const resetRepo = () => {
    setRepoName('');
    setNotification();
    clearFileFilters();
    clearSelectedFiles();
  };

  return (
    <div>
      <RepositoryInput setRepo={setRepo} resetRepo={resetRepo} />
      {isLoadingRepoBranches && <Loading />}
      {hasBranches && (
        <Branches
          branches={branches}
          setSelectedBranchName={setSelectedBranchName}
          selectedBranch={selectedBranch}
        />
      )}
      {hasSelectedBranch && (
        <>
          <LastCommit commit={selectedBranch.lastCommit} repo={repoName} />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="md:col-span-1">
            {isLoadingRepoFiles ? (
              <Loading />
            ) : hasFiles ? (
              <FileList
                files={displayedFiles}
                toggleFileSelect={toggleFileSelect}
              />
            ) : (
              <NoRepositorySelected />
            )}
          </div>
          {hasFiles && (
            <div className="md:col-span-2 min-h-[100vh]">
              <div className="bg-white dark:bg-gray-800 shadow p-6 rounded min-h-full">
                <Result
                  files={selectedFiles}
                  isLoadingFileContents={isLoadingFileContents}
                  clearFiles={clearSelectedFiles}
                  toggleContentCollapse={toggleContentCollapse}
                  totalCharCount={totalCharCount}
                  handleCopy={handleCopy}
                  handleDownload={handleDownload}
                  selectedFileContents={selectedFileContents}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
