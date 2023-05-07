import { GitHubFile, GithubBranch } from './types';

interface State {
  files: GitHubFile[];
  repo: string;
  isLoadingRepoFiles: boolean;
  isLoadingFileContents: boolean;
  isLoadingRepoBranches: boolean;
  selectedBranch: string;
  branches: GithubBranch[];
  searchQuery: string;
  fileExtensions: string[];
  selectedExtensions: string[];
  notification: null | {
    message: string;
    type: 'success' | 'error';
  },
}

export type Action =
  | { type: 'RESET_REPO' }
  | { type: 'SET_FILES'; payload: GitHubFile[] }
  | { type: 'SET_COLLAPSED_FILES'; payload: Set<string> }
  | { type: 'SET_REPO'; payload: string }
  | { type: 'SET_IS_LOADING_REPO_FILES'; payload: boolean }
  | { type: 'SET_IS_LOADING_FILE_CONTENTS'; payload: boolean }
  | { type: 'SET_IS_LOADING_REPO_BRANCHES'; payload: boolean }
  | { type: 'SET_SELECTED_BRANCH'; payload: string }
  | {
    type: 'SET_BRANCHES';
    payload: Array<GithubBranch>;
  }
  | { type: 'SET_SELECTED_FILE_EXTENSIONS'; payload: string[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILE_EXTENSIONS'; payload: string[] }
  | { type: 'TOGGLE_SELECT_FILE'; payload: string }
  | { type: 'TOGGLE_CONTENT_COLLAPSE'; payload: string }
  | { type: 'CLEAR_SELECTED_FILES' }
  | { type: 'SET_NOTIFICATION'; payload: State['notification'] }
  | { type: 'CLEAR_NOTIFICATION' };

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
    case 'SET_IS_LOADING_REPO_BRANCHES':
      return { ...state, isLoadingRepoBranches: action.payload };
    case 'SET_SELECTED_BRANCH':
      return { ...state, selectedBranch: action.payload };
    case 'SET_BRANCHES':
      return { ...state, branches: action.payload };
    case 'RESET_REPO':
      return { ...initialState };
    case 'SET_SELECTED_FILE_EXTENSIONS':
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
    case 'SET_NOTIFICATION':
      return { ...state, notification: action.payload };
    case 'CLEAR_NOTIFICATION':
      return { ...state, notification: null };
    default:
      return state;
  }
};

export const initialState: State = {
  files: [],
  repo: '',
  isLoadingRepoBranches: false,
  isLoadingRepoFiles: false,
  isLoadingFileContents: false,
  selectedBranch: '',
  branches: [],
  selectedExtensions: [],
  searchQuery: '',
  fileExtensions: [],
  notification: null,
};
