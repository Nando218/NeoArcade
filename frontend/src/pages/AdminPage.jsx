
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { NeonText } from '@/components/ui/neon-text';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useScores } from '@/lib/scores';
import { getGameById } from '@/lib/games';

import { ShieldAlert, Users, Trophy, Trash2, Shield, UserCog } from 'lucide-react';
import { authAPI } from '@/lib/api';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { scores, addScore } = useScores();
  const [selectedTab, setSelectedTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [actionFeedback, setActionFeedback] = useState({ type: '', message: '' });
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, navigate, user]);
  
  // Cargar todos los usuarios
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin' && selectedTab === 'users') {
      loadUsers();
    }
  }, [isAuthenticated, user, selectedTab]);
  
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.getAllUsers();
      setUsers(data.users);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Users could not be loaded');
    } finally {
      setLoading(false);
    }
  };
  
  // Eliminar usuario
  const handleDeleteUser = async (userId, username) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar al usuario ${username}?`)) return;
    
    setActionInProgress(true);
    try {
      await authAPI.deleteUser(userId);
      // Actualizar lista de usuarios
      setUsers(users.filter(u => u.id !== userId));
      setActionFeedback({ 
        type: 'success', 
        message: `User ${username} deleted successfully` 
      });
    } catch (err) {
      console.error('Error deleting user:', err);
      setActionFeedback({ 
        type: 'error', 
        message: `Error deleting user: ${err.response?.data?.message || err.message}` 
      });
    } finally {
      setActionInProgress(false);
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setActionFeedback({ type: '', message: '' }), 5000);
    }
  };
  
  // Cambiar rol de usuario
  const handleToggleUserRole = async (userId, username, currentRole) => {
    const newRole = currentRole === 'user' ? 'admin' : 'user';
    const action = currentRole === 'user' ? 'grant admin privileges to' : 'revoke admin privileges from';
    
    if (!confirm(`Are you sure you want to ${action} ${username}?`)) return;
    
    setActionInProgress(true);
    try {
      const { user: updatedUser } = await authAPI.updateUserRole(userId, newRole);
      // Actualizar el usuario en la lista
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setActionFeedback({ 
        type: 'success', 
        message: `Role of ${username} updated to ${newRole === 'admin' ? 'Administrator' : 'User'}` 
      });
    } catch (err) {
      console.error('Error updating user role:', err);
      setActionFeedback({ 
        type: 'error', 
        message: `Error updating user role: ${err.response?.data?.message || err.message}` 
      });
    } finally {
      setActionInProgress(false);
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setActionFeedback({ type: '', message: '' }), 5000);
    }
  };
  
  if (!user || user.role !== 'admin') return null;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  const getGameName = (gameId) => {
    const game = getGameById(gameId);
    return game ? game.name : gameId;
  };
  
  const handleDeleteScore = (score) => {
    alert(`Score of ${score.username} in ${getGameName(score.gameId)} deleted`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
           
            <span className="text-3xl">
              ADMIN PANEL
            </span>
          </div>
          
          <div className="flex border-b border-arcade-neon-blue/50 mb-6">
            <button
              className={`py-3 px-6 font-pixel flex items-center gap-2 ${
                selectedTab === 'users'
                  ? 'text-arcade-neon-blue border-b-2 border-arcade-neon-blue'
                  : 'text-gray-400 hover:text-arcade-neon-blue'
              }`}
              onClick={() => setSelectedTab('users')}
            >
              <Users size={18} />
              <span>USERS</span>
            </button>
            <button
              className={`py-3 px-6 font-pixel flex items-center gap-2 ${
                selectedTab === 'scores'
                  ? 'text-arcade-neon-blue border-b-2 border-arcade-neon-blue'
                  : 'text-gray-400 hover:text-arcade-neon-blue'
              }`}
              onClick={() => setSelectedTab('scores')}
            >
              <Trophy size={18} />
              <span>SCORES</span>
            </button>
          </div>
          
          {selectedTab === 'users' && (
            <div className="bg-arcade-dark border-2 border-arcade-neon-blue shadow-[0_0_15px_rgba(0,255,255,0.3)] rounded-lg p-6">
              {/* Feedback message */}
              {actionFeedback.message && (
                <div className={`mb-4 p-3 rounded font-pixel text-sm ${
                  actionFeedback.type === 'success' 
                    ? 'bg-arcade-neon-blue/10 text-arcade-neon-blue border border-arcade-neon-blue/30' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/30'
                }`}>
                  {actionFeedback.message}
                </div>
              )}
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-arcade-neon-blue border-r-transparent"></div>
                  <p className="mt-2 font-pixel text-arcade-neon-blue">Loading users...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="font-pixel text-red-400">{error}</p>
                  <button 
                    className="mt-4 font-pixel text-arcade-neon-blue hover:underline"
                    onClick={loadUsers}
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-arcade-neon-blue/30">
                        <th className="px-6 py-3 text-left text-sm font-bold text-arcade-neon-green font-pixel tracking-wider">
                          <b>ID</b>
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-arcade-neon-green font-pixel tracking-wider">
                          <b>Name</b>
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-arcade-neon-green font-pixel tracking-wider">
                          <b>Email</b>
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-arcade-neon-green font-pixel tracking-wider">
                          <b>Rol</b>
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-arcade-neon-green font-pixel tracking-wider">
                          <b>Actions</b>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-arcade-neon-blue/20">
                      {users.map((userData) => (
                        <tr key={userData.id} className="hover:bg-arcade-neon-blue/5">
                          <td className="px-6 py-4 whitespace-nowrap font-pixel text-gray-400">
                            {userData.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-pixel text-white">
                            {userData.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-pixel text-white">
                            {userData.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`font-pixel px-2 py-1 rounded text-xs ${
                              userData.role === 'admin'
                                ? 'bg-arcade-neon-purple/20 text-arcade-neon-purple'
                                : 'bg-arcade-neon-blue/20 text-arcade-neon-blue'
                            }`}>
                              {userData.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-pixel">
                            <div className="flex space-x-3">
                              {/* No permitir acciones en el propio usuario administrador */}
                              {parseInt(userData.id) !== parseInt(user.id) && (
                                <>
                                  <button 
                                    className="text-arcade-neon-blue hover:text-arcade-neon-blue flex items-center gap-1"
                                    onClick={() => handleToggleUserRole(userData.id, userData.username, userData.role)}
                                    disabled={actionInProgress}
                                  >
                                    {userData.role === 'user' ? (
                                      <>
                                        <Shield size={14} />
                                        <span className="font-pixel text-sm">Make Admin</span>
                                      </>
                                    ) : (
                                      <>
                                        <UserCog size={14} />
                                        <span className="font-pixel text-sm">Make User</span>
                                      </>
                                    )}
                                  </button>
                                  
                                  <button 
                                    className="text-red-500 hover:text-red-400 flex items-center gap-1"
                                    onClick={() => handleDeleteUser(userData.id, userData.username)}
                                    disabled={actionInProgress}
                                  >
                                    <Trash2 size={14} />
                                    <span className="font-pixel text-sm">Delete</span>
                                  </button>
                                </>
                              )}
                              
                              {/* Indicar que es el usuario actual */}
                              {parseInt(userData.id) === parseInt(user.id) && (
                                <span className="text-gray-500 font-pixel text-sm italic">
                                  (You)
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      
                      {users.length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center font-pixel text-gray-400">
                            No users to display
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {selectedTab === 'scores' && (
            <div className="bg-arcade-dark border-2 border-arcade-neon-blue shadow-[0_0_15px_rgba(57,255,20,0.3)] rounded-lg p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-arcade-neon-blue/30">
                      <th className="px-6 py-3 text-left text-sm font-medium text-arcade-neon-blue font-pixel tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-arcade-neon-blue font-pixel tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-arcade-neon-blue font-pixel tracking-wider">
                        Game
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-arcade-neon-blue font-pixel tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-arcade-neon-blue font-pixel tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-arcade-neon-blue font-pixel tracking-wider">
                        Acctions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-arcade-neon-blue/20">
                    {scores.map((score) => (
                      <tr key={score.id} className="hover:bg-arcade-neon-blue/5">
                        <td className="px-6 py-4 whitespace-nowrap font-pixel text-gray-400">
                          {score.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-pixel text-white">
                          {score.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-pixel text-white">
                          {getGameName(score.gameId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-pixel text-arcade-neon-yellow">
                          {score.points.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-pixel text-gray-400">
                          {formatDate(score.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            className="text-red-500 hover:text-red-400 flex items-center gap-1"
                            onClick={() => handleDeleteScore(score)}
                          >
                            <Trash2 size={14} />
                            <span className="font-pixel text-sm">Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
