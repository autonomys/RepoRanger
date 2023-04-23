import { GitHubFile } from './types';

interface State {
  files: GitHubFile[];
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

// test

export type Action =
  | { type: 'RESET' }
  | { type: 'SET_FILES'; payload: GitHubFile[] }
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
  | { type: 'TOGGLE_SELECT_FILE'; payload: string }
  | { type: 'TOGGLE_CONTENT_COLLAPSE'; payload: string }
  | { type: 'CLEAR_SELECTED_FILES' };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_FILES':
      return { ...state, files: action.payload };
    case 'TOGGLE_SELECT_FILE': {
      return {
        ...state,
        files: state.files.map((file) => {
          if (file.path === action.payload) {
            return {
              ...file,
              isSelected: !file.isSelected,
              isCollapsed: file.isSelected ? file.isCollapsed : false,
            };
          }
          return file;
        }),
      };
    }
    case 'TOGGLE_CONTENT_COLLAPSE': {
      return {
        ...state,
        files: state.files.map((file) => {
          if (file.path === action.payload) {
            return { ...file, isCollapsed: !file.isCollapsed };
          }
          return file;
        }),
      };
    }
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
      return { ...state, files: state.files.map((file) => ({ ...file, isSelected: false, isCollapsed: false })) };
    default:
      return state;
  }
};

export const initialState: State = {
  files: [],
  repo: '',
  isLoadingRepoFiles: false,
  isLoadingFileContents: false,
  selectedBranch: '',
  branches: [],
  selectedExtensions: [],
  searchQuery: '',
  fileExtensions: [],
};
