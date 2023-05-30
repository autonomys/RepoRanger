import { useState, useCallback } from 'react';
import { submitPrompt } from '../langchain';

export function useLangchain() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (files: string) => {
      try {
        setError(null);
        setLoading(true);
        const response = await submitPrompt(prompt, files);
        setResponse(response?.text);
      } catch (error) {
        const errorMessage = 'Failed to submit prompt';
        console.error(errorMessage, error);
        setError(errorMessage);
        // setNotification({
        //   message: errorMessage,
        //   type: 'error',
        // });
      } finally {
        setLoading(false);
      }
    },
    [prompt]
  );

  return {
    submit,
    response,
    isLoadingLangchain: loading,
    submitPromptError: error,
    prompt,
    setPrompt,
  };
}
