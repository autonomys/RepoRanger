import { GithubIcon, MoonIcon, SunIcon } from './icons';
import { useTheme } from '../ThemeProvider';

export const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-2xl p-4 font-extrabold shadow-md flex justify-between items-center">
      <span className="inline-block mx-auto">
        Repo<span className="text-blue-300">Ranger</span>
      </span>
      <div className="flex gap-4">
        <button onClick={toggleTheme}>
          {isDark ? <MoonIcon /> : <SunIcon />}
        </button>
        <a
          href="https://github.com/isSerge/reporanger"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon />
        </a>
      </div>
    </header>
  );
};
