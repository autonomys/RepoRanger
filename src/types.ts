export interface GitHubFile {
  name: string;
  path: string;
  index: number;
  isSelected: boolean;
  isCollapsed: boolean;
}

export interface GithubBranch {
  name: string;
  lastCommit: { hash: string; message: string; timestamp: string };
}

export interface Notification {
  message: string;
  type: 'error' | 'success';
}
