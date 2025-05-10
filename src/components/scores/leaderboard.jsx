
import { useState, useEffect } from 'react';
import { useScores } from '@/lib/scores';
import { getGameById, GAMES } from '@/lib/games';


export function Leaderboard() {
  const [selectedGameId, setSelectedGameId] = useState('all');
  const [scores, setScores] = useState([]);
  const { getScoresByGame, scores: allScores } = useScores();
  
  useEffect(() => {
    if (selectedGameId === 'all') {
      // Ordenar por puntuación de mayor a menor
      setScores([...allScores].sort((a, b) => b.points - a.points));
    } else {
      setScores(getScoresByGame(selectedGameId));
    }
  }, [selectedGameId, allScores, getScoresByGame]);
  
  // Formatear fecha para mostrarla legible
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  // Obtener nombre del juego
  const getGameName = (gameId) => {
    const game = getGameById(gameId);
    return game ? game.name : gameId;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 mb-4">
         
          
        </div>
        
      </div>
      
      <div className="bg-arcade-dark border-2 border-arcade-neon-blue/50 rounded-lg shadow-[0_0_10px_rgba(0,255,0,0.3)] overflow-hidden">
        <div className="p-4 border-b border-arcade-neon-blue/30">
          <select
            value={selectedGameId}
            onChange={(e) => setSelectedGameId(e.target.value)}
            className="bg-black text-white border-2 border-arcade-neon-blue/50 rounded px-4 py-2 w-full font-pixel focus:outline-none focus:border-arcade-neon-blue"
          >
            <option value="all">All games</option>
            {GAMES.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-arcade-neon-blue/10 border-b border-arcade-neon-blue/30">
                <th className="px-6 py-3 text-left text-sm font-medium text-arcade-neon-blue font-pixel tracking-wider">
                  Rankin
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-arcade-neon-blue font-pixel tracking-wider">
                  Player
                </th>
                {selectedGameId === 'all' && (
                  <th className="px-6 py-3 text-left text-sm font-medium text-arcade-neon-blue font-pixel tracking-wider">
                    Game
                  </th>
                )}
                <th className="px-6 py-3 text-left text-sm font-medium text-arcade-neon-blue font-pixel tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-arcade-neon-blue font-pixel tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-arcade-neon-blue/20">
              {scores.length > 0 ? (
                scores.map((score, index) => (
                  <tr key={score.id} className="hover:bg-arcade-neon-blue/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-pixel text-white">
                        {index === 0 && <span className="text-blue-300">🏆</span>}
                        {index === 1 && <span className="text-gray-300">🥈</span>}
                        {index === 2 && <span className="text-amber-600">🥉</span>}
                        {index > 2 && <span>{index + 1}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-pixel text-white">
                      {score.username}
                    </td>
                    {selectedGameId === 'all' && (
                      <td className="px-6 py-4 whitespace-nowrap font-pixel text-gray-300">
                        {getGameName(score.gameId)}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap font-pixel text-arcade-neon-blue">
                      {score.points.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-pixel text-gray-400">
                      {formatDate(score.date)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={selectedGameId === 'all' ? 5 : 4} 
                    className="px-6 py-8 text-center text-gray-500 font-pixel"
                  >
                    No scores available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
