import {
  useState,
  // useEffect,
  useCallback
} from 'react';
import { fetchBranches } from '../api';
import { GithubBranch, Notification } from '../types';

export function useBranches(repoUrl: string, setNotification: (n: Notification) => void) {
  const [branches, setBranches] = useState<GithubBranch[]>([]);
  const [selectedBranch, selectBranch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepoBranches = useCallback(
    async (repo: string) => {
      try {
        setError(null);
        setLoading(true);
        const branches = await fetchBranches(repo).then((branches) =>
          branches.sort((a, b) => {
            // Sorting branches so that 'main' or 'master' always comes first
            if (a.name === 'main' || a.name === 'master') return -1;
            if (b.name === 'main' || b.name === 'master') return 1;
            return a.name.localeCompare(b.name);
          })
        );
        setBranches(branches);
        selectBranch(selectedBranch ? selectedBranch : branches[0].name);
      } catch (error) {
        const errorMessage = 'Failed to fetch repository branches';
        console.error(errorMessage, error);
        setError(errorMessage);
        setNotification({
          message: errorMessage,
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    },
    [selectedBranch, setNotification]
  );

  // useEffect(() => {
  //   if (repoUrl) {
  //     // Refetching branches every 6 seconds
  //     const interval = setInterval(() => {
  //       setError(null);
  //       fetchBranches(repoUrl)
  //         .then((branches) =>
  //           branches.sort((a, b) => {
  //             // Sorting branches so that 'main' or 'master' always comes first
  //             if (a.name === 'main' || a.name === 'master') return -1;
  //             if (b.name === 'main' || b.name === 'master') return 1;
  //             return a.name.localeCompare(b.name);
  //           })
  //         )
  //         .then((branches) => setBranches(branches))
  //         .catch((error) => {
  //           const errorMessage = 'Failed to fetch repository branches';
  //           console.error(errorMessage, error);
  //           setError(errorMessage);
  //           setNotification({
  //             message: errorMessage,
  //             type: 'error',
  //           });
  //         });
  //     }, 6000);

  //     return () => clearInterval(interval);
  //   }
  // }, [repoUrl, setNotification]);

  const selectedBranchItem = branches.find(
    (branch: GithubBranch) => branch.name === selectedBranch
  );

  return {
    branches,
    selectedBranch: selectedBranchItem,
    isLoadingRepoBranches: loading,
    selectBranch,
    loadRepoBranchesError: error,
    lastCommit: selectedBranchItem?.lastCommit.hash,
    fetchRepoBranches,
  };
}
