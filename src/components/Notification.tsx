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
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed top-4 right-4 p-4 bg-blue-500 text-white rounded-lg shadow-md flex items-center space-x-4 z-50">
      <div className="flex-shrink-0">{type}</div>
      <div>
        <h3 className="font-semibold">{type.toLocaleUpperCase()}</h3>
        <p className="text-sm">{message}</p>
      </div>
      <button
        className="p-1 hover:bg-blue-700 rounded focus:outline-none"
        onClick={handleClose}
      >
        close
      </button>
    </div>
  );
};
