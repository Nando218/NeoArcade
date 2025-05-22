
import { useState, useEffect } from 'react';
import { useScores } from '@/lib/scores';
import { getGameById, GAMES } from '@/lib/games';
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Leaderboard() {
  const [selectedGameId, setSelectedGameId] = useState('all');
  const [scores, setScores] = useState([]);
  const { getScoresByGame, fetchScoresByGame, scores: allScores, isLoading, error } = useScores();
  
  // Cargar todas las puntuaciones al inicio
  useEffect(() => {
    const loadScores = async () => {
      try {
        // Cargar puntuaciones para todos los juegos
        for (const game of GAMES) {
          await fetchScoresByGame(game.id);
        }
      } catch (err) {
        console.error('Error loading scores:', err);
        toast({
          title: "Error",
          description: "No se pudieron cargar las puntuaciones",
          variant: "destructive",
        });
      }
    };
    
    loadScores();
  }, [fetchScoresByGame]);
  
  // Actualizar las puntuaciones mostradas cuando cambie la selección o las puntuaciones
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

  if (isLoading) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-arcade-neon-blue font-pixel">Loading scores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-red-500 font-pixel">Error: {error}</p>
      </div>
    );
  }

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
          <Table>
            <TableHeader>
              <TableRow className="bg-arcade-neon-blue/10 border-b border-arcade-neon-blue/30">
                <TableHead className="px-6 py-3 text-left text-sm font-medium text-arcade-neon-blue font-pixel tracking-wider">
                  Ranking
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-sm font-medium text-arcade-neon-blue font-pixel tracking-wider">
                  Player
                </TableHead>
                {selectedGameId === 'all' && (
                  <TableHead className="px-6 py-3 text-left text-sm font-medium text-arcade-neon-blue font-pixel tracking-wider">
                    Game
                  </TableHead>
                )}
                <TableHead className="px-6 py-3 text-left text-sm font-medium text-arcade-neon-blue font-pixel tracking-wider">
                  Score
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-sm font-medium text-arcade-neon-blue font-pixel tracking-wider">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-arcade-neon-blue/20">
              {scores.length > 0 ? (
                scores.map((score, index) => (
                  <TableRow key={score.id} className="hover:bg-arcade-neon-blue/5">
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="font-pixel text-white">
                        {index === 0 && <span className="text-blue-300">🏆</span>}
                        {index === 1 && <span className="text-gray-300">🥈</span>}
                        {index === 2 && <span className="text-amber-600">🥉</span>}
                        {index > 2 && <span>{index + 1}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap font-pixel text-white">
                      {score.username}
                    </TableCell>
                    {selectedGameId === 'all' && (
                      <TableCell className="px-6 py-4 whitespace-nowrap font-pixel text-gray-300">
                        {getGameName(score.gameId)}
                      </TableCell>
                    )}
                    <TableCell className="px-6 py-4 whitespace-nowrap font-pixel text-arcade-neon-blue">
                      {score.points.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap font-pixel text-gray-400">
                      {formatDate(score.date)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={selectedGameId === 'all' ? 5 : 4} 
                    className="px-6 py-8 text-center text-gray-500 font-pixel"
                  >
                    No scores available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
