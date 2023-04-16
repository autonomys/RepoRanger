interface CopyToClipboardButtonProps {
  content: string;
}

export const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({ content }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      alert('Contents copied to clipboard.');
    });
  };

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleCopy}
    >
      Copy Contents
    </button>
  );
};
