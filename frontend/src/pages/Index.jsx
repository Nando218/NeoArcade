
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import WelcomeScreen from './WelcomeScreen';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ProfilePage from './ProfilePage';
import LeaderboardPage from './LeaderboardPage';
import AdminPage from './AdminPage';
import GamePage from './GamePage';
import NotFound from './NotFound';
import { useAuth } from '@/lib/auth';

export default function Index() {
  const { isAuthenticated, user, refreshProfile } = useAuth();
  
  useEffect(() => {
    if (localStorage.getItem('arcade-token')) {
      refreshProfile();
    }
  }, [refreshProfile]);
  
  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route 
        path="/admin" 
        element={isAuthenticated && user?.role === 'admin' ? <AdminPage /> : <Navigate to="/home" />} 
      />
      <Route path="/games/:gameId" element={<GamePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
