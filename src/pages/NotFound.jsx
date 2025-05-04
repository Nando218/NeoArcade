
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { NeonText } from '@/components/ui/neon-text';
import { ArcadeButton } from '@/components/ui/arcade-button';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <NeonText color="purple" className="text-6xl mb-4" glitch>
              404
            </NeonText>
            <NeonText color="blue" className="text-2xl mb-6">
              PÁGINA NO ENCONTRADA
            </NeonText>
          </div>
          
          <p className="text-gray-300 font-pixel mb-8 max-w-md mx-auto">
            GAME OVER - La página que buscas no existe en el universo de NeoArcade.
            ¿Quieres volver a la pantalla de inicio para continuar jugando?
          </p>
          
          <Link to="/">
            <ArcadeButton variant="green" className="animate-pulse">
              INSERT COIN TO CONTINUE
            </ArcadeButton>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
