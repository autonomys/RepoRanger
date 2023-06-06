import { Link, Navigate } from 'react-router-dom';
import { Button } from './components/Button';
import { useResult } from './context/ResultContext';
import { useLangchain } from './context/LangchainContext';
import { useFiles } from './context/FilesContext';
import { GitHubFile } from './types';
import { Loading } from './components';

const models = ['gpt-3.5-turbo', 'gpt-4'];

export const Prompt = () => {
  const {
    prompt,
    setPrompt,
    submitPrompt,
    messages,
    model,
    setModel,
    apiKey,
    setApiKey,
    isLoadingLangchain,
  } = useLangchain();
  const { fileContent } = useResult();
  const { selectedFiles } = useFiles();

  if (!fileContent.length) {
    return <Navigate to="/" />;
  }

  const handleSubmit = () => {
    submitPrompt(prompt, fileContent);
    setPrompt('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full bg-white dark:bg-gray-800 shadow p-6 rounded">
      <div className="md:col-span-1">
        <p className="text-gray-800 dark:text-gray-200 mb-2">Selected files:</p>
        <ul>
          {selectedFiles.map((file: GitHubFile) => (
            <li key={file.path} className="text-gray-800 dark:text-gray-200">
              - {file.path}
            </li>
          ))}
        </ul>
      </div>
      <div className="md:col-span-3">
        <div className="mb-6">
          {messages.map((message: any, i: number) => (
            <p
              key={i}
              className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-x-auto text-gray-800 dark:text-gray-200"
            >
              <strong>{message.user}</strong>: {message.content}
            </p>
          ))}
          {isLoadingLangchain && (
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-x-auto text-gray-800 dark:text-gray-200">
              <Loading />
            </div>
          )}
        </div>
        <div className="flex items-stretch gap-2 min-w-full mb-4">
          <input
            disabled={!apiKey}
            className="resize border rounded-md p-2 w-full"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={!apiKey}>
            Submit
          </Button>
        </div>
        <Link to="/">
          <p className="text-white">Go back</p>
        </Link>
      </div>
      <div className="md:col-span-1">
        <div className="mb-4">
          <p className="text-gray-800 dark:text-gray-200 mb-2">
            Open AI API key:
          </p>
          <input
            className="resize border rounded-md p-2 w-full"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            type="password"
          />
        </div>
        <div>
          <p className="text-gray-800 dark:text-gray-200 mb-2">Model:</p>
          {models.map((modelItem, index) => (
            <label
              key={index}
              className="flex items-center mr-4 mb-2 cursor-pointer text-sm font-medium dark:text-gray-300"
            >
              <input
                type="radio"
                name="branch"
                value={modelItem}
                checked={modelItem === model}
                onChange={() => setModel(modelItem)}
                className="text-blue-500 mr-2"
              />
              {modelItem}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
