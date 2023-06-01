// components/PromptScreen.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useLangchain } from './hooks/useLangchain';
import { Button } from './components/Button';

export const Prompt: React.FC = () => {
  const {
    submit,
    response,
    isLoadingLangchain,
    submitPromptError,
    prompt,
    setPrompt,
  } = useLangchain();

  const handleSubmit = () => {
    submit(prompt);
  };

  return (
    <>
      {/* existing logic in PromptModal component */}
      <Button onClick={handleSubmit}>Submit</Button>
      <Link to="/">Go back to Main Screen</Link>
    </>
  );
};
