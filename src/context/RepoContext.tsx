import { createContext, useContext, useState, FC, ReactNode } from 'react';

type RepoState = {
  repoUrl: string;
  repoName: string;
  setRepoName: (repoName: string) => void;
  setRepoUrl: (repoUrl: string) => void;
};

const initialRepoState: RepoState = {
  repoName: '',
  repoUrl: '',
  setRepoName: () => {},
  setRepoUrl: () => {},
};

const RepoContext = createContext<RepoState>(initialRepoState);

type Props = {
  children: ReactNode;
};

export const RepoProvider: FC<Props> = ({ children }) => {
  const [repoName, setRepoName] = useState<string>('');
  const [repoUrl, setRepoUrl] = useState<string>('');

  const value = {
    repoName,
    repoUrl,
    setRepoName,
    setRepoUrl,
  };

  return <RepoContext.Provider value={value}>{children}</RepoContext.Provider>;
};

export const useRepo = () => useContext(RepoContext);
