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
  Button,
} from './components';
import { useBranches, useFiles, useFileFilter, useResult } from './hooks';
import { Notification as INotification } from './types';
import { useLangchain } from './hooks/useLangchain';

function App() {
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

  const {
    submit,
    response,
    isLoadingLangchain,
    submitPromptError,
    prompt,
    setPrompt,
  } = useLangchain();

  console.log({
    isLoadingLangchain,
    submitPromptError,
    response,
  });

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
    setNotification(null);
    clearFileFilters();
    clearSelectedFiles();
  };

  const handleSubmit = () => {
    const fileContent = [...selectedFileContents.values()].join('\n\n');
    submit(fileContent);
  };

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
            <RepositoryInput setRepo={setRepo} resetRepo={resetRepo} />
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
                <LastCommit
                  commit={selectedBranch.lastCommit}
                  repo={repoName}
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
                      <div className="flex items-stretch gap-2 min-w-full mb-4">
                        <input
                          className="resize border rounded-md p-2 w-full"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                        />
                        <Button onClick={handleSubmit}>Submit</Button>
                      </div>
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
