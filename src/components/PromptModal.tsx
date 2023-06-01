import { useState } from 'react';
import { Button } from './Button';
import { useLangchain } from '../hooks/useLangchain';

interface ModalProps {
  content: string;
}

export const PromptModal: React.FC<ModalProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    submit,
    response,
    isLoadingLangchain,
    submitPromptError,
    prompt,
    setPrompt,
  } = useLangchain();

  const handleSubmit = () => {
    submit(prompt);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button onClick={toggleModal}>Chat</Button>
      {isOpen ? (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <div>
                    <div>
                      {isLoadingLangchain ? (
                        <p>Loading...</p>
                      ) : submitPromptError ? (
                        <p className="text-red-500">{submitPromptError}</p>
                      ) : null}
                    </div>
                    <p className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-gray-800 dark:text-gray-200 mb-4">
                      {response}
                    </p>
                    <div className="flex items-stretch gap-2 min-w-full mb-4">
                      <input
                        className="resize border rounded-md p-2 w-full"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                      <Button onClick={handleSubmit}>Submit</Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button onClick={toggleModal}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
