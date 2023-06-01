// components/PromptScreen.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './components/Button';
import { useAppState } from './StateProvider';

export const Prompt: React.FC = () => {
  const { prompt, setPrompt, submitPrompt, modelResponse } = useAppState();

  return (
    <>
      <div className="flex items-stretch gap-2 min-w-full mb-4">
        <input
          className="resize border rounded-md p-2 w-full"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button onClick={() => submitPrompt(prompt)}>Submit</Button>
      </div>
      <Link to="/">Go back to Main Screen</Link>
    </>
  );
};
