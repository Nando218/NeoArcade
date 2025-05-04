import { Github, Twitter, Instagram } from 'lucide-react';
import { NeoArcadelogo } from '@/components/ui/neo-arcade-logo';

export function Footer() {
  return (
    <footer className="bg-arcade-dark border-t-2 border-arcade-neon-blue/50 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl mb-2">
              <NeoArcadelogo size="md" />
            </h3>
           
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
           
            
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-arcade-neon-blue transition-colors">
                <Github size={40} />
              </a>
              <a href="#" className="text-gray-400 hover:text-arcade-neon-blue transition-colors">
                <Twitter size={40} />
              </a>
              <a href="#" className="text-gray-400 hover:text-arcade-neon-blue transition-colors">
                <Instagram size={40} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 text-gray-500 text-sm font-pixel">
          <p>© {new Date().getFullYear()} Rewind Arcade. All Right Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
