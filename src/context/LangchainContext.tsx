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
  user: 'model' | 'user';
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
  model: string;
  setModel: (model: string) => void;
  apiKey: string;
  setApiKey: (apiKey: string) => void;
};

const initialResultState: LangchainState = {
  submitPrompt: () => {},
  isLoadingLangchain: false,
  submitPromptError: null,
  prompt: '',
  setPrompt: () => {},
  messages: [],
  model: 'gpt-3.5-turbo',
  setModel: () => {},
  apiKey: '',
  setApiKey: () => {},
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
    { user: 'model', content: 'Hello! How can I help you today?' },
  ]);

  const [apiKey, setApiKey] = useState<string>('');
  const [model, setModel] = useState('gpt-3.5-turbo');

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
        const response = await apiSubmitPrompt(prompt, files, model, apiKey);
        handleNewMessage({ user: 'model', content: response?.text });
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
    [apiKey, handleNewMessage, model, setNotification]
  );

  const value = {
    submitPrompt,
    isLoadingLangchain: loading,
    submitPromptError: error,
    prompt,
    setPrompt,
    messages,
    model,
    setModel,
    apiKey,
    setApiKey,
  };

  return (
    <LangchainContext.Provider value={value}>
      {children}
    </LangchainContext.Provider>
  );
};

export const useLangchain = () => useContext(LangchainContext);
