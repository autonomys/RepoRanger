import { GithubIcon, MoonIcon, SunIcon } from './icons';
import { useTheme } from '../context/ThemeProvider';

export const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-gray-800 dark:to-gray-900 text-white dark:text-gray-200 p-4 font-semibold shadow-md flex justify-between items-center">
      <div>
        <h1 className="text-2xl">Repo<span className="text-blue-300 dark:text-blue-500">Ranger</span></h1>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="focus:outline-none">
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
        <a
          href="https://github.com/isSerge/reporanger"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300"
        >
          <GithubIcon />
        </a>
      </div>
    </header>
  );
};
