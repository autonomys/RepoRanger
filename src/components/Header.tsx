import { GithubIcon } from "./icons";

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-2xl p-4 font-extrabold shadow-md flex justify-between items-center">
      <span className="inline-bloc mx-auto">
        Repo<span className="text-blue-300">Ranger</span>
      </span>
      <a
        href="https://github.com/isSerge/reporanger"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GithubIcon />
      </a>
    </header>
  );
};
