import { GitHubFile } from './types';

interface State {
  files: GitHubFile[];
  selectedFiles: Set<string>;
  collapsedFiles: Set<string>;
  repo: string;
  isLoadingRepoFiles: boolean;
  isLoadingFileContents: boolean;
  selectedBranch: string;
  branches: {
    name: string;
    lastCommit: { hash: string; message: string; timestamp: string };
  }[];
  searchQuery: string;
  fileExtensions: string[];
  selectedExtensions: string[];
}

export type Action =
  | { type: 'RESET' }
  | { type: 'SET_FILES'; payload: GitHubFile[] }
  | { type: 'SET_SELECTED_FILES'; payload: Set<string> }
  | { type: 'SET_COLLAPSED_FILES'; payload: Set<string> }
  | { type: 'SET_REPO'; payload: string }
  | { type: 'SET_IS_LOADING_REPO_FILES'; payload: boolean }
  | { type: 'SET_IS_LOADING_FILE_CONTENTS'; payload: boolean }
  | { type: 'SET_SELECTED_BRANCH'; payload: string }
  | {
    type: 'SET_BRANCHES';
    payload: Array<{
      name: string;
      lastCommit: { hash: string; message: string; timestamp: string };
    }>;
  }
  | { type: 'SET_SELECTED_FILE_EXTENSION'; payload: string[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILE_EXTENSIONS'; payload: string[] }
  | { type: 'CLEAR_SELECTED_FILES' };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_FILES':
      return { ...state, files: action.payload };
    case 'SET_SELECTED_FILES':
      return { ...state, selectedFiles: action.payload };
    case 'SET_COLLAPSED_FILES':
      return { ...state, collapsedFiles: action.payload };
    case 'SET_REPO':
      return { ...state, repo: action.payload };
    case 'SET_IS_LOADING_REPO_FILES':
      return { ...state, isLoadingRepoFiles: action.payload };
    case 'SET_IS_LOADING_FILE_CONTENTS':
      return { ...state, isLoadingFileContents: action.payload };
    case 'SET_SELECTED_BRANCH':
      return { ...state, selectedBranch: action.payload };
    case 'SET_BRANCHES':
      return { ...state, branches: action.payload };
    case 'RESET':
      return { ...initialState };
    case 'SET_SELECTED_FILE_EXTENSION':
      return {
        ...state,
        selectedExtensions: action.payload,
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    case 'SET_FILE_EXTENSIONS':
      return {
        ...state,
        fileExtensions: action.payload,
      };
    case 'CLEAR_SELECTED_FILES':
      return { ...state, selectedFiles: new Set() };
    default:
      return state;
  }
};

export const initialState: State = {
  files: [],
  selectedFiles: new Set(),
  collapsedFiles: new Set(),
  repo: '',
  isLoadingRepoFiles: false,
  isLoadingFileContents: false,
  selectedBranch: '',
  branches: [],
  selectedExtensions: [],
  searchQuery: '',
  fileExtensions: [],
};
