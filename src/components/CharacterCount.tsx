import { formatNumber } from '../utils';

interface CharacterCountProps {
  totalCharCount: number;
  charLimit: number;
}

export const CharacterCount: React.FC<CharacterCountProps> = ({
  totalCharCount,
  charLimit,
}) => {
  const isCharLimitReached = totalCharCount > charLimit;
  return (
    <div className="mb-4">
      <div className="font-semibold mb-2">
        Total character count: {formatNumber(totalCharCount)} /{' '}
        {formatNumber(charLimit)}
      </div>
      <p
        className={`text-red-500 font-semibold text-sm ${
          isCharLimitReached ? 'visible' : 'invisible'
        }`}
      >
        Character limit exceeded. Please select fewer files or use{' '}
        <a
          className="underline"
          href="https://chatgpt-prompt-splitter.jjdiaz.dev/"
          target="_blank"
          rel="noreferrer"
        >
          ChatGPT PROMPTs Splitter
        </a>
      </p>
    </div>
  );
};
