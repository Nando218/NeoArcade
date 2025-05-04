
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CyberButton } from '@/components/ui/cyber-button';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Set isLoaded to true after a short delay to trigger animations
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    // Si el usuario ya está autenticado, redirigir directamente a la página principal
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  const handleStart = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-arcade-darker">
      <div className="flex flex-col items-center space-y-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ 
            opacity: isLoaded ? 1 : 0, 
            scale: isLoaded ? 1 : 0.8,
            y: isLoaded ? 0 : -20
          }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.2
          }}
          className="w-full max-w-xl"
        >
          <img 
            src="https://res.cloudinary.com/dgzgzx9ov/image/upload/v1744616542/NeoArcade_Logo_xgyh1q.png" 
            alt="NeoArcade Logo" 
            className="w-full h-auto"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isLoaded ? 1 : 0, 
            scale: isLoaded ? 1 : 0.8
          }}
          transition={{ 
            delay: 0.8,
            duration: 0.5
          }}
        >
          <CyberButton 
            onClick={handleStart}
            className="font-arcade text-2xl tracking-wider border-2 border-arcade-neon-blue bg-purple hover:bg-arcade-neon-purple text-arcade-neon-blue px-12 py-4 shadow-[0_0_10px_rgba(0,255,255,0.7)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.9)] flex justify-center"
          >
            START 
          </CyberButton>
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute bottom-4 text-sm text-gray-400 font-pixel"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 0.6 : 0 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
      
      </motion.div>
    </div>
  );
}
