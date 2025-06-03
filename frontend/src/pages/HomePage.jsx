import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GameCard } from '@/components/games/game-card';
import { GAMES } from '@/lib/games';


export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categoryNames = {
    all: 'All the games',
    puzzle: 'Puzzle',
    action: 'Action',
    strategy: 'Strategy',
    classic: 'Classics'
  };
  
  const filteredGames = selectedCategory === 'all' 
    ? GAMES 
    : GAMES.filter(game => game.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <section className="mb-16">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="mb-4 flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/dgzgzx9ov/image/upload/v1745514711/LogoPerson_s9pmbg.png"
                alt="NeoArcade Logo"
                className="h-72 mb-4 object-contain animate-fade-in-up"
              />
            </div>
            
            <p className="max-w-2xl text-lg text-gray-300 font-pixel">
            Relive the nostalgia of the arcades with this collection of classic games. Compete for the highest scores and become a legend.
            </p>
          </div>
          
          <div className="flex justify-center mb-8 overflow-x-auto py-2 no-scrollbar">
            <div className="flex flex-col gap-2 w-full max-w-xs sm:max-w-none sm:flex-row sm:space-x-2 sm:gap-0 sm:justify-center sm:items-center">
              {(['all', 'puzzle', 'action', 'strategy', 'classic']).map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-3 rounded font-pixel text-base sm:text-sm transition-all duration-200 whitespace-nowrap w-full sm:w-auto ${
                    selectedCategory === category
                      ? 'bg-arcade-neon-blue text-black border-2 border-arcade-neon-blue shadow-[0_0_8px_rgba(0,255,255,0.7)]'
                      : 'bg-transparent border-2 border-arcade-neon-blue/30 text-arcade-neon-blue/80 hover:border-arcade-neon-blue hover:text-arcade-neon-blue'
                  }`}
                >
                  {categoryNames[category]}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
