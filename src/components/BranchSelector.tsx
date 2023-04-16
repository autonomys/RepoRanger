import React from 'react';

interface BranchSelectorProps {
  branches: { name: string, lastCommit: { hash: string, message: string, timestamp: string } }[];
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
}

export const BranchSelector: React.FC<BranchSelectorProps> = ({
  branches,
  selectedBranch,
  onBranchChange,
}) => {

  return (
    <div className="mb-4">
      <span className="block mb-2 text-sm font-medium text-gray-700">Select Branch:</span>
      <div className="flex flex-wrap">
        {branches.map((branch, index) => (
          <label
            key={index}
            className="flex items-center mr-4 mb-2 cursor-pointer text-sm"
          >
            <input
              type="radio"
              name="branch"
              value={branch.name}
              checked={selectedBranch === branch.name}
              onChange={e => onBranchChange(e.target.value)}
              className="form-radio text-blue-500 mr-2"
            />
            {branch.name}
          </label>
        ))}
      </div>
    </div>
  );  
};
