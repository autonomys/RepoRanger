import React from 'react';

interface BranchSelectorProps {
  branches: string[];
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
}

export const BranchSelector: React.FC<BranchSelectorProps> = ({
  branches,
  selectedBranch,
  onBranchChange,
}) => {
  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onBranchChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor="branch-select" className="block mb-2">
        Select Branch:
      </label>
      <select
        id="branch-select"
        value={selectedBranch}
        onChange={handleBranchChange}
        className="border border-gray-300 rounded p-2"
      >
        {branches.map((branch, index) => (
          <option key={index} value={branch}>
            {branch}
          </option>
        ))}
      </select>
    </div>
  );
};
