import { useEffect, useState } from 'react';
import { CloseIcon, ExclamationIcon, CheckIcon } from './icons';

interface NotificationProps {
  message: string;
  type: string;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setVisible(true);
      }, 100);
    }
  }, [message]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  const isError = type === 'error';

  const visibleClass = visible
    ? 'opacity-100 translateY-0'
    : 'opacity-0 -translate-y-2';

  return (
    <div
      className={`text-gray-700 dark:text-gray-300 fixed top-4 right-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md transition-all duration-300 ease-in-out ${visibleClass} flex items-center space-x-4 z-50`}
    >
      <div className="flex-shrink">
        {isError ? (
          <div className="text-red-600">
            <ExclamationIcon />
          </div>
        ) : (
          <div className="text-green-600">
            <CheckIcon />
          </div>
        )}
      </div>
      <div>
        <h3 className="font-semibold">{type.toLocaleUpperCase()}</h3>
        <p className="text-sm">{message}</p>
      </div>
      <button
        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded focus:outline-none"
        onClick={handleClose}
      >
        <CloseIcon />
      </button>
    </div>
  );
};
