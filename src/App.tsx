import { useEffect, useState } from 'react';
import { fetchAllFiles, getSelectedFiles, fetchBranches } from './utils';
import { GitHubFile } from './types';
import {
  RepositoryInput,
  SelectedFiles,
  BranchSelector,
  Loading,
  NoRepositorySelected,
  FileList,
} from './components';

function App() {
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [repo, setRepo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [branches, setBranches] = useState<string[]>([]);

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
      const branches = await fetchBranches(repo).then((branches) =>
        branches.sort((a, b) => {
          // Sorting branches so that 'main' or 'master' always comes first
          if (a === 'main' || a === 'master') return -1;
          if (b === 'main' || b === 'master') return 1;
          return a.localeCompare(b);
        })
      );

      setBranches(branches);
      setSelectedBranch(branches[0]);
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

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white text-xl p-4">RepoRanger</header>
      <main className="p-4">
        <div className="container mx-auto">
          <div>
            <RepositoryInput onSubmit={handleRepoSubmit} />
            {repo && (
              <BranchSelector
                branches={branches}
                selectedBranch={selectedBranch}
                onBranchChange={setSelectedBranch}
              />
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
