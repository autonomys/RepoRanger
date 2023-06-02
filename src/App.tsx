import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Header, Notification } from './components';
import { Main } from './Main';
import { Prompt } from './Prompt';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Notification />
        <Header />
        <main className="p-4">
          <div className="container max-w-full">
            <Routes>
              <Route path="/prompt" element={<Prompt />} />
              <Route path="/" element={<Main />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
