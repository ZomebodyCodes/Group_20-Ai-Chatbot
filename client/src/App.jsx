import { BrowserRouter, Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import AddFactsPage from './pages/AddFactsPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/add-facts" element={<AddFactsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;