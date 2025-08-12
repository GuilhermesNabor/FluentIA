import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PlacementTestPage from './pages/PlacementTestPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import LessonPage from './pages/LessonPage';
import QuizPage from './pages/QuizPage';
import ChatPage from './pages/ChatPage';
import ThemeToggle from './components/ThemeToggle';

const AppHeader = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('test_completed');
    navigate('/login');
  };

  return (
    <header className="app-header">
      <Link to={token ? "/dashboard" : "/login"} className="logo">FluentIA</Link>
      
      {token && (
        <div className="header-controls">
          <ThemeToggle />
          <button onClick={handleLogout} className="header-logout-button">
            Sair
          </button>
        </div>
      )}
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="app-layout">
        <AppHeader />
        <main className="app-main-content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Navigate replace to="/login" />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/placement-test" element={<PlacementTestPage />} />
              <Route path="/lesson/:lessonId" element={<LessonPage />} /> 
              <Route path="/quiz/:attemptId" element={<QuizPage />} />
              <Route path="/chat" element={<ChatPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;