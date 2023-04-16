import { useEffect, useState } from 'react';
import { getSelectedFiles } from './utils';
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
} from './components';

function App() {
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [repo, setRepo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [branches, setBranches] = useState<
    {
      name: string;
      lastCommit: { hash: string; message: string; timestamp: string };
    }[]
  >([]);

  useEffect(() => {
    setSelectedFiles(new Set());
  }, [repo]);

  useEffect(() => {
    let isCancelled = false;

    if (repo) {
      setIsLoading(true);
      fetchAllFiles(repo, selectedBranch).then((data) => {
        if (!isCancelled) {
          setFiles(data);
          setIsLoading(false);
        }
      });
    }

    return () => {
      isCancelled = true;
      setIsLoading(false);
    };
  }, [repo, selectedBranch]);

  const handleRepoSubmit = async (repo: string) => {
    try {
      const branches = await fetchBranches(repo);

      setBranches(branches);
      setSelectedBranch(branches[0].name);
      setRepo(repo);
    } catch (error) {
      alert('Failed to fetch repository branches');
    }
  };

  const handleSelection = (file: GitHubFile) => {
    setSelectedFiles((prevSelectedFiles) =>
      getSelectedFiles(prevSelectedFiles, file)
    );
  };

  const handleReset = () => {
    setFiles([]);
    setSelectedFiles(new Set());
    setRepo('');
    setIsLoading(false);
    setSelectedBranch('');
    setBranches([]);
  };

  const selectedBranchItem = branches.find(
    (branch) => branch.name === selectedBranch
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white text-xl p-4">RepoRanger</header>
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
                onBranchChange={setSelectedBranch}
              />
            )}
            {selectedBranchItem && (
              <LastCommit commit={selectedBranchItem.lastCommit} />
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                {isLoading ? (
                  <Loading />
                ) : repo ? (
                  <FileList
                    files={files}
                    selectedFiles={selectedFiles}
                    handleSelection={handleSelection}
                  />
                ) : (
                  <NoRepositorySelected />
                )}
              </div>
              {repo && (
                <div className="md:col-span-2">
                  <div className="bg-white shadow p-6 rounded">
                    <SelectedFiles
                      selectedFiles={selectedFiles}
                      files={files}
                      repo={repo}
                      branch={selectedBranch}
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
