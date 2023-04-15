import { FileList } from './components/FileList';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white text-xl p-4">RepoRanger</header>
      <main className="p-4">
        <FileList />
      </main>
    </div>
  );
}

export default App;
