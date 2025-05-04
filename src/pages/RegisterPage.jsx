
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { RegisterForm } from '@/components/auth/register-form';
import { CyberButton } from '@/components/ui/cyber-button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { ArcadeButton } from '@/components/ui/arcade-button';
import { Link } from 'react-router-dom';


export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-md mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-pixel mb-2">
            CREATE ACCOUNT
          </h2>
          <p className="text-gray-400 font-pixel">
            Join the arcade community and start tracking your scores
          </p>
        </div>
        
        <RegisterForm />
        
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4 font-pixel">Already have an account?</p>
          <Link to="/login">
            <div className="flex items-center justify-center">
              <CyberButton variant="blue">LOG IN</CyberButton>
            </div>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
