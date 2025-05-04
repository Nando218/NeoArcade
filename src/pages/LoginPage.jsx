
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { LoginForm } from '@/components/auth/login-form';
import { NeonText } from '@/components/ui/neon-text';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { CyberButton } from '../components/ui/cyber-button';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-md mb-8 text-center">
          <h1 className="text-3xl font-bold">LOGIN</h1>
          <p className="text-gray-400 font-pixel">
            Access your account to save your scores and compete in the leaderboard
          </p>
        </div>
        
        <LoginForm />
        
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4 font-pixel">Don't have an account?</p>
          <Link to="/register">
            <CyberButton variant="pink">CREATE ACCOUNT</CyberButton>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
