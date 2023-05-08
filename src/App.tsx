import { useState } from 'react';
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
  Notification,
} from './components';
import { useBranches, useFiles, useFileFilter, useResult } from './hooks';
import { Notification as INotification } from './types';

function App() {
  const [repo, setRepo] = useState<string>('');
  const [notification, setNotification] = useState<INotification | null>(null);

  const {
    isLoadingRepoBranches,
    branches,
    selectedBranch,
    loadRepoBranchesError,
    selectBranch,
  } = useBranches(repo, setNotification);

  const {
    isLoadingRepoFiles,
    files,
    fileExtensions,
    loadRepoFilesError,
    toggleFileSelect,
    selectedFiles,
    toggleContentCollapse,
    clearSelectedFiles,
  } = useFiles(repo, selectedBranch?.name, setNotification);

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
  } = useResult(selectedFiles, repo, selectedBranch?.name!, setNotification);

  const hasErrors = loadRepoBranchesError || loadRepoFilesError;
  const hasBranches = !hasErrors && branches.length > 0;
  const hasSelectedBranch = !hasErrors && selectedBranch;
  const hasFiles = repo && !hasErrors && files.length > 0;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <Header />
      <main className="p-4">
        <div className="container mx-auto">
          <div>
            <RepositoryInput setRepo={setRepo} resetRepo={() => setRepo('')} />
            {isLoadingRepoBranches && <Loading />}
            {hasBranches && (
              <Branches
                branches={branches}
                selectedBranch={selectedBranch}
                selectBranch={selectBranch}
              />
            )}
            {hasSelectedBranch && (
              <>
                <LastCommit commit={selectedBranch.lastCommit} repo={repo} />
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
        </div>
      </main>
    </div>
  );
}

export default App;
