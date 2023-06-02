import {
  createContext,
  useContext,
  useState,
  useCallback,
  FC,
  ReactNode,
} from 'react';
import { fetchBranches } from '../api';
import { GithubBranch } from '../types';
import { useNotification } from './NotificationContext';

type BranchesState = {
  branches: GithubBranch[];
  selectedBranchName: string;
  isLoadingRepoBranches: boolean;
  loadRepoBranchesError: string | null;
  lastCommit: string | undefined;
  fetchRepoBranches: (repo: string) => Promise<void>;
  setSelectedBranchName: (branchName: string) => void;
  selectedBranch: GithubBranch | undefined;
};

const initialBranchesState: BranchesState = {
  branches: [],
  selectedBranchName: '',
  isLoadingRepoBranches: false,
  loadRepoBranchesError: null,
  lastCommit: undefined,
  fetchRepoBranches: async () => {},
  setSelectedBranchName: () => {},
  selectedBranch: undefined,
};

const BranchesContext = createContext<BranchesState>(initialBranchesState);

type Props = {
  children: ReactNode;
};

export const BranchesProvider: FC<Props> = ({ children }) => {
  const [branches, setBranches] = useState<GithubBranch[]>([]);
  const [selectedBranchName, setSelectedBranchName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setNotification } = useNotification();

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
        setSelectedBranchName(
          selectedBranchName ? selectedBranchName : branches[0].name
        );
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
    [selectedBranchName, setNotification]
  );

  const selectedBranch = branches.find(
    (branch: GithubBranch) => branch.name === selectedBranchName
  );

  const value = {
    branches,
    selectedBranchName,
    isLoadingRepoBranches: loading,
    loadRepoBranchesError: error,
    lastCommit: branches.find(
      (branch: GithubBranch) => branch.name === selectedBranchName
    )?.lastCommit.hash,
    fetchRepoBranches,
    setSelectedBranchName,
    selectedBranch,
  };

  return (
    <BranchesContext.Provider value={value}>
      {children}
    </BranchesContext.Provider>
  );
};

export const useBranches = () => useContext(BranchesContext);
