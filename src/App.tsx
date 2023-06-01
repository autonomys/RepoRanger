import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Header, Notification } from './components';
import { Main } from './Main';
import { Prompt } from './Prompt';
import { useAppState } from './StateProvider';

function App() {
  const { notification, setNotification } = useAppState();
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
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
