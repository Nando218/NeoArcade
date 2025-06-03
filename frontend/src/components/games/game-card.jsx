import { Link } from 'react-router-dom';

import { CyberButton } from '@/components/ui/cyber-button';
import GameOverGlitchText from '@/games/tetris/GameOverGlitchText';

export function GameCard({ game }) {
  const bgColors = {
    puzzle: 'bg-arcade-neon-blue/20',
    action: 'bg-arcade-neon-orange/20',
    strategy: 'bg-arcade-neon-purple/20',
    classic: 'bg-arcade-neon-green/20',
  };

  // Colores de texto según categoría
  const textColors = {
    puzzle: 'blue',
    action: 'orange',
    strategy: 'purple',
    classic: 'green',
  };
 

  return (
    <div className="group flex flex-col h-full bg-arcade-dark border-2 border-arcade-neon-blue/30 hover:border-arcade-neon-blue rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] animate-fade-in-up">
      <div className={`aspect-video ${['tetris', 'tictactoe', 'snake', 'pong'].includes(game.id) ? '' : bgColors[game.category]} relative overflow-hidden`}>
        {game.id === 'tetris' ? (
          <>
            <img 
              src={"https://res.cloudinary.com/dgzgzx9ov/image/upload/v1744797913/tetris_kvp48x.png"}
              alt={game.name}
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0"
            />
            <img
              src="https://res.cloudinary.com/dgzgzx9ov/image/upload/v1748512780/tetrisgif_rcjinp.gif"
              alt="Tetris GIF"
              className="h-[95%] w-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute inset-x-0 top-1/2 transform -translate-y-1/2"
            />
          </>
        ) : game.id === 'tictactoe' ? (
          <>
            <img 
              src={"https://res.cloudinary.com/dgzgzx9ov/image/upload/v1747241592/tictactoe_cjo4va.png"}
              alt={game.name}
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0"
            />
            <img
              src="https://res.cloudinary.com/dgzgzx9ov/image/upload/v1748514491/tictactoegif_oayxv8.gif"
              alt="TicTacToe GIF"
              className="w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute inset-0"
            />
          </>
        ) : game.id === 'snake' ? (
          <>
            <img 
              src={"https://res.cloudinary.com/dgzgzx9ov/image/upload/v1747241809/snake_kr5xh9.png"}
              alt={game.name}
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0"
            />
            <img
              src="https://res.cloudinary.com/dgzgzx9ov/image/upload/v1748515714/snakegif_mm2yzd.gif"
              alt="Snake GIF"
              className="w-full h-full object-contain bg-black transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute inset-0"
            />
          </>
        ) : game.id === 'pong' ? (
          <>
            <img 
              src={game.imageUrl}
              alt={game.name}
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0"
            />
            <img
              src="https://res.cloudinary.com/dgzgzx9ov/image/upload/v1748516721/ponggif_t8uwzj.gif"
              alt="Pong GIF"
              className="w-full h-full object-contain bg-black transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute inset-0"
            />
          </>
        ) : game.id === 'connect4' ? (
          <>
            <img 
              src={game.imageUrl}
              alt={game.name}
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0"
            />
            <img
              src="https://res.cloudinary.com/dgzgzx9ov/image/upload/v1748517155/conncect4gif_ea8cj6.gif"
              alt="Connect4 GIF"
              className="w-full h-full object-contain bg-black transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute inset-0"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl opacity-70 group-hover:opacity-90 transition-opacity duration-300">
              {game.name}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between p-4 flex-grow">
        <div>
          <h3 className="font-pixel text-2xl mb-1 text-white">
            <GameOverGlitchText text={game.name} className="text-lg md:text-xl" />
          </h3>
          <div className="flex items-center space-x-2 mb-3">
            <span className={`font-pixel text-xs text-arcade-neon-${textColors[game.category]}`}>
              {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-4 font-pixel">{game.description}</p>
        </div>
        <Link to={game.path} className="w-full flex justify-center">
          <CyberButton>PLAY</CyberButton>
        </Link>
      </div>
    </div>
  );
}

