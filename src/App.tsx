import { GitHubFileList } from './GitHubFileList';

function App() {
  return (
    <div className="App">
      <header className="bg-blue-500 text-white text-xl p-4">
        GitHub File List
      </header>
      <main className="p-4">
        <GitHubFileList />
      </main>
    </div>
  );
}

export default App;
