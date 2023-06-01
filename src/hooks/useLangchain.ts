import { useState, useCallback } from 'react';
import { submitPrompt as apiSubmitPrompt } from '../langchain';
import { Notification } from '../types';

export function useLangchain(setNotification: (n: Notification) => void) {
  const [prompt, setPrompt] = useState('');
  const [modelResponse, setResponse] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submitPrompt = useCallback(
    async (files: string) => {
      try {
        setError(null);
        setLoading(true);
        const response = await apiSubmitPrompt(prompt, files);
        setResponse(response?.text);
      } catch (error) {
        const errorMessage = 'Failed to submit prompt';
        console.error(errorMessage, error);
        setError(errorMessage);
        setNotification({
          message: errorMessage,
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    },
    [prompt, setNotification]
  );

  return {
    submitPrompt,
    modelResponse,
    isLoadingLangchain: loading,
    submitPromptError: error,
    prompt,
    setPrompt,
  };
}
