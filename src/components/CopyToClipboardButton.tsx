import React from 'react';
import { Button } from './Button';

interface CopyToClipboardButtonProps {
  content: string;
}

export const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  content,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      alert('Contents copied to clipboard.');
    });
  };

  return <Button onClick={handleCopy}>Copy Contents</Button>;
};
