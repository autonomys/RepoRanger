import { FC, createContext, useContext, ReactNode, useState } from 'react';

import { Notification as INotification } from '../types';

type State = {
  notification?: INotification;
  setNotification: (notification?: INotification) => void;
};

const initialNotificationState = {
  notification: undefined,
  setNotification: () => {},
};

const NotificationContext = createContext<State>(initialNotificationState);

type Props = {
  children?: ReactNode;
};

export const NotificationProvider: FC<Props> = ({ children }) => {
  const [notification, setNotification] = useState<INotification | undefined>(
    undefined
  );

  return (
    <NotificationContext.Provider
      value={{
        notification,
        setNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): State => {
  const context = useContext(NotificationContext);

  if (!context)
    throw new Error(
      'NotificationContext must be used within NotificationProvider'
    );

  return context;
};
