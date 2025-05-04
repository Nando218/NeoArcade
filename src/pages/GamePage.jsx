import { useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { NeonText } from '@/components/ui/neon-text';
import { getGameById } from '@/lib/games';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TetrisGame } from '@/games/tetris/tetris-game';
import { TicTacToeGame } from '@/games/tictactoe/tictactoe-game';
import { ArcadeButton } from '@/components/ui/arcade-button';
import { ArrowLeft } from 'lucide-react';

export default function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = gameId ? getGameById(gameId) : undefined;
  
  useEffect(() => {
    if (!game) {
      navigate('/');
    }
  }, [game, navigate]);
  
  if (!game) return null;
  
  const renderGame = () => {
    switch (game.id) {
      case 'tetris':
        return <TetrisGame />;
      case 'tictactoe':
        return <TicTacToeGame />;
      default:
        return (
          <div className="text-center py-12">
            <NeonText color="yellow" className="text-2xl mb-4">
              EN DESARROLLO
            </NeonText>
            <p className="text-gray-300 font-pixel mb-6">
              Este juego está en desarrollo y estará disponible próximamente.
            </p>
            <ArcadeButton onClick={() => navigate('/')}>
              VOLVER AL INICIO
            </ArcadeButton>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-5xl">
            <Link to="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-arcade-neon-blue mb-6 font-pixel">
              <ArrowLeft size={16} />
              <span>BACK TO GAMES</span>
            </Link>
            
            <div className="bg-arcade-dark border-2 border-arcade-neon-blue/50 shadow-[0_0_15px_rgba(0,255,255,0.2)] rounded-lg p-6 mb-8">
              
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

