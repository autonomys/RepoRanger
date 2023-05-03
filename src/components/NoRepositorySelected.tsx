export const NoRepositorySelected = () => {
  return (
    <div className="bg-white dark:bg-gray-700 shadow p-6 rounded">
      <p className="text-gray-600 dark:text-gray-300">
        Please submit a GitHub repository URL to display its files.
      </p>
    </div>
  );
};
