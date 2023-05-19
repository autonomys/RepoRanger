import { Octokit } from "@octokit/core";
import { GitHubFile, GithubBranch } from './types';

const octokit = new Octokit({ auth: process.env.REACT_APP_GITHUB_TOKEN });

type GithubFileContentResponse = {
  content: string;
  encoding: string;
  size: number;
  [key: string]: any;
};

type GithubBranchResponse = {
  name: string;
  commit: {
    sha: string;
  }
}[];

type GithubCommitResponse = {
  sha: string;
  commit: {
    message: string;
    author: {
      date: string;
    }
  }
};

export const fetchAllFiles = async (repoName: string, branch: string, signal?: AbortSignal): Promise<GitHubFile[]> => {
  const [owner, repo] = repoName.split('/');
  const { data } = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
    owner,
    repo,
    tree_sha: branch,
    recursive: '1',
    request: { signal },
  });

  if (!Array.isArray(data.tree)) {
    throw new Error('Unexpected response format from GitHub API');
  }

  const files: GitHubFile[] = data.tree
    .filter((file) => file.type === 'blob')
    .map((file, index) => {
      const path = file.path || '';
      return {
        name: path?.split('/').pop() || '',
        path: path,
        index,
        isSelected: false,
        isCollapsed: false,
      }
    });

  return files;
};

export const fetchFileContent = async (
  repoName: string,
  branch: string,
  path: string,
  signal?: AbortSignal,
): Promise<{ content: string; size: number; }> => {
  const [owner, repo] = repoName.split('/');
  const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner,
    repo,
    path,
    ref: branch,
    request: { signal }
  });

  const responseData = data as GithubFileContentResponse;
  if (responseData.encoding !== 'base64') {
    throw new Error('Unexpected encoding format from GitHub API');
  }

  return { content: atob(responseData.content), size: responseData.size };
};

export const fetchBranches = async (repoName: string, signal?: AbortSignal): Promise<GithubBranch[]> => {
  const [owner, repo] = repoName.split('/');
  const { data } = await octokit.request('GET /repos/{owner}/{repo}/branches', {
    owner,
    repo,
    request: { signal }
  });

  const branchesData = data as GithubBranchResponse;

  const branchPromises = branchesData.map(async (branch) => {
    const { data: commitData } = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
      owner,
      repo,
      ref: branch.commit.sha,
    });

    const commitResponse = commitData as GithubCommitResponse;

    return {
      name: branch.name,
      lastCommit: {
        hash: commitResponse.sha,
        message: commitResponse.commit.message,
        timestamp: commitResponse.commit.author?.date || '',
      },
    };
  });

  const branches = await Promise.all(branchPromises);
  return branches;
};
