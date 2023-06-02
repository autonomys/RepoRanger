import {
  createContext,
  useContext,
  useState,
  FC,
  ReactNode,
  useCallback,
} from 'react';
import { submitPrompt as apiSubmitPrompt } from '../langchain';
import { useNotification } from './NotificationContext';

type Message = {
  user: 'bot' | 'user';
  content: string;
};

type MessageList = Message[];

type LangchainState = {
  submitPrompt: (prompt: string, files: string) => void;
  isLoadingLangchain: boolean;
  submitPromptError: string | null;
  prompt: string;
  setPrompt: (prompt: string) => void;
  messages: MessageList;
};

const initialResultState: LangchainState = {
  submitPrompt: () => {},
  isLoadingLangchain: false,
  submitPromptError: null,
  prompt: '',
  setPrompt: () => {},
  messages: [],
};

const LangchainContext = createContext<LangchainState>(initialResultState);

type Props = {
  children: ReactNode;
};

export const LangchainProvider: FC<Props> = ({ children }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageList>([
    { user: 'bot', content: 'Hello! How can I help you today?' },
  ]);

  const { setNotification } = useNotification();

  const handleNewMessage = useCallback((message: Message) => {
    setMessages((messages) => [...messages, message]);
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

  const value = {
    submitPrompt,
    isLoadingLangchain: loading,
    submitPromptError: error,
    prompt,
    setPrompt,
    messages,
  };

  return (
    <LangchainContext.Provider value={value}>
      {children}
    </LangchainContext.Provider>
  );
};

export const useLangchain = () => useContext(LangchainContext);
