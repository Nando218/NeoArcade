
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { NeonText } from '@/components/ui/neon-text';
import { useAuth } from '@/lib/auth';
import { useScores } from '@/lib/scores';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getGameById } from '@/lib/games';
import { ArcadeButton } from '@/components/ui/arcade-button';
import { User, Trophy, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { getUserScores, fetchUserScores } = useScores();
  const navigate = useNavigate();
  const [userScores, setUserScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user) {
      setUserScores(getUserScores(user.id));
      
      setIsLoading(true);
      fetchUserScores(user.id)
        .then(scores => {
          setUserScores(scores);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [isAuthenticated, navigate, user, getUserScores, fetchUserScores]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!user) return null;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getGameName = (gameId) => {
    const game = getGameById(gameId);
    return game ? game.name : gameId;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="bg-arcade-dark border-2 border-arcade-neon-blue shadow-[0_0_15px_rgba(0,255,255,0.3)] rounded-lg p-6">
                <div className="flex justify-center mb-6">
                  <div className="h-24 w-24 rounded-full bg-arcade-neon-blue/20 flex items-center justify-center">
                    <User size={48} className="text-arcade-neon-blue" />
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <p className="text-xl mb-2">{user.username}</p>
                  <p className="text-gray-400 font-pixel">{user.email}</p>
                  <div className="inline-block px-3 py-1 mt-2 rounded-full bg-arcade-neon-purple/20 text-arcade-neon-purple text-xs font-pixel">
                    {user.role === 'admin' ? 'Admin' : 'Player'}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between font-pixel">
                    <span className="text-gray-300">Total scores:</span>
                    <span className="text-arcade-neon-green">{userScores.length}</span>
                  </div>
                  
                  <div className="flex justify-between font-pixel">
                    <span className="text-gray-300">Total points:</span>
                    <span className="text-arcade-neon-yellow">
                      {userScores.reduce((sum, score) => sum + score.points, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="mt-8">
                
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <div className="bg-arcade-dark border-2 border-arcade-neon-blue shadow-[0_0_15px_rgba(0,255,255,0.3)] rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="text-arcade-neon-blue" size={20} />
                  <span className="text-arcade-neon-blue text-xl font-pixel">
                    MY SCORES
                  </span>
                </div>
                
                {userScores.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-arcade-neon-blue/30">
                          <th className="px-4 py-3 text-left text-sm font-medium text-arcade-neon-blue font-pixel tracking-wider">
                            Game
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-arcade-neon-blue font-pixel tracking-wider">
                            Score
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-arcade-neon-blue font-pixel tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-arcade-neon-blue/20">
                        {userScores.map((score) => (
                          <tr key={score.id} className="hover:bg-arcade-neon-blue/5">
                            <td className="px-4 py-3 whitespace-nowrap font-pixel text-white">
                              {getGameName(score.gameId)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap font-pixel text-arcade-neon-yellow">
                              {score.points.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap font-pixel text-gray-400">
                              {formatDate(score.date)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-400 font-pixel mb-4">
                      You don't have any scores recorded yet
                    </p>
                    
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
