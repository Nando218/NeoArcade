import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Leaderboard } from '@/components/scores/leaderboard';


export default function LeaderboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="text-center mb-10">
          <span className="text-4xl mb-2 text-yellow-foreground">
            LEADERBOARD
          </span>
          <p className="text-gray-300 font-pixel max-w-2xl mx-auto">
            Compete with other players for the highest scores in each game and become
            a Rewind Arcade legend.
          </p>
        </div>
        
        <Leaderboard />
      </main>
      
      <Footer />
    </div>
  );
}
