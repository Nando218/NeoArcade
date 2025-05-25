import { Link } from 'react-router-dom';

import { CyberButton } from '@/components/ui/cyber-button';

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
      <div className={`aspect-video ${['tetris', 'tictactoe', 'snake'].includes(game.id) ? '' : bgColors[game.category]} relative overflow-hidden`}>
        {game.id === 'tetris' ? (
          <>
            <img 
              src={"https://res.cloudinary.com/dgzgzx9ov/image/upload/v1744797913/tetris_kvp48x.png"}
              alt={game.name}
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0"
            />
            <img
              src="https://i.gifer.com/1DDX.gif"
              alt="Tetris GIF"
              className="w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute inset-0"
            />
          </>
        ) : ['tictactoe', 'snake'].includes(game.id) ? (
          <img 
            src={game.id === 'tictactoe'
              ? "https://res.cloudinary.com/dgzgzx9ov/image/upload/v1747241592/tictactoe_cjo4va.png"
              : "https://res.cloudinary.com/dgzgzx9ov/image/upload/v1747241809/snake_kr5xh9.png"}
            alt={game.name}
            className="w-full h-full object-cover"
          />
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
          <h3 className="font-pixel text-2xl mb-1 text-white">{game.name}</h3>
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

