import { useState, useCallback } from 'react';
import { submitPrompt as apiSubmitPrompt } from '../langchain';
import { Notification } from '../types';

type Message = {
  user: 'bot' | 'user',
  content: string,
};

type MessageList = Message[];

export function useLangchain(setNotification: (n: Notification) => void) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageList>([
    { user: 'bot', content: 'Hello! How can I help you today?' }
  ]);

  const handleNewMessage = useCallback((message: Message) => {
    setMessages(messages => [...messages, message]);
  }, []);

  const submitPrompt = useCallback(
    async (prompt: string, files: string) => {
      try {
        setError(null);
        setLoading(true);
        handleNewMessage({ user: 'user', content: prompt });
        const response = await apiSubmitPrompt(prompt, files);
        handleNewMessage({ user: 'bot', content: response?.text });
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
    [handleNewMessage, setNotification]
  );

  return {
    submitPrompt,
    isLoadingLangchain: loading,
    submitPromptError: error,
    prompt,
    setPrompt,
    messages,
  };
}
