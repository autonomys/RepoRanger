import { Link, Navigate } from 'react-router-dom';
import { Button } from './components/Button';
import { useAppState } from './StateProvider';

export const Prompt = () => {
  const { prompt, setPrompt, submitPrompt, messages, fileContent } =
    useAppState();

  if (!fileContent.length) {
    return <Navigate to="/" />;
  }

  const handleSubmit = () => {
    submitPrompt(prompt, fileContent);
    setPrompt('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow p-6 rounded">
      <div className="mb-6">
        {messages.map((message: any, i: number) => (
          <p
            key={i}
            className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-x-auto text-gray-800 dark:text-gray-200"
          >
            <strong>{message.user}</strong>: {message.content}
          </p>
        ))}
      </div>
      <div className="flex items-stretch gap-2 min-w-full mb-4">
        <input
          className="resize border rounded-md p-2 w-full"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
      <Link to="/">
        <p className="text-white">Go back to main page</p>
      </Link>
    </div>
  );
};
