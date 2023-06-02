import { memo, ChangeEvent } from 'react';
import { GithubBranch } from '../types';

interface BranchesProps {
  branches: GithubBranch[];
  selectedBranch: GithubBranch | undefined;
  setSelectedBranchName: (branchName: string) => void;
}

export const Branches: React.FC<BranchesProps> = memo(
  ({ branches, selectedBranch, setSelectedBranchName }) => {
    function handleBranchChange({ target }: ChangeEvent<HTMLInputElement>) {
      setSelectedBranchName(target.value);
    }
    return (
      <div className="mb-4">
        <span className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Branch:
        </span>
        <div className="flex flex-wrap">
          {branches.map((branch, index) => (
            <label
              key={index}
              className="flex items-center mr-4 mb-2 cursor-pointer text-sm font-medium dark:text-gray-300"
            >
              <input
                type="radio"
                name="branch"
                value={branch.name}
                checked={selectedBranch?.name === branch.name}
                onChange={handleBranchChange}
                className="text-blue-500 mr-2"
              />
              {branch.name}
            </label>
          ))}
        </div>
      </div>
    );
  }
);
