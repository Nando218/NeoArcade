
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { ArcadeButton } from '@/components/ui/arcade-button';

import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !email || !password) {
      setError('Please complete all fields');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      // Trim whitespace from inputs to prevent issues
      const trimmedUsername = username.trim();
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      
      console.log('Trying to register user:', { 
        username: trimmedUsername, 
        email: trimmedEmail,
        passwordLength: trimmedPassword.length
      });
      
      const success = await register(trimmedUsername, trimmedEmail, trimmedPassword);
      
      if (!success) {
        console.log('Registration failed without specific error');
        setError('Unable to complete registration. Please try with a different email and username.');
      } else {
        console.log('Registration completed successfully from the form');
        toast({
          title: "Registration successful",
          description: "Wellcome to Rewind Arcade!",
          variant: "default", 
        });
      }
    } catch (err) {
      console.error('Error in registration form:', err);
      console.error('Error details:', err.response?.data);
      
      if (err.response?.data?.message?.includes('Email already exists')) {
        setError('This email is already registered');
      } else if (err.response?.data?.message?.includes('Username already exists')) {
        setError('This username is already registered');
      } else if (err.code === 'ECONNABORTED' || !err.response) {
        const errorMessage = 'Connection error with the server. Make sure the backend is running on http://localhost:3001';
        setError(errorMessage);
        toast({
          title: "Connection error",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        const errorMessage = `Registration error: ${err.response?.data?.message || err.message || 'Unknown error'}`;
        setError(errorMessage);
        toast({
          title: "Registration error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="w-full max-w-md">
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6 bg-arcade-dark p-8 rounded-lg border-2 border-arcade-neon-blue shadow-[0_0_20px_rgba(0,255,255,0.3)]"
      >
        
        
        {error && (
          <div className="flex items-center gap-2 bg-red-900/30 border border-red-500 p-3 rounded text-red-300">
            <AlertCircle size={16} className="text-red-400" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium font-pixel text-gray-300" htmlFor="username">
              User Name
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Player 1"
              className="bg-black border-arcade-neon-blue/50 focus:border-arcade-neon-blue text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium font-pixel text-gray-300" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="bg-black border-arcade-neon-blue/50 focus:border-arcade-neon-blue text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium font-pixel text-gray-300" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-black border-arcade-neon-blue/50 focus:border-arcade-neon-blue text-white"
              required
            />
          </div>
        </div>
        
        <ArcadeButton 
          type="submit" 
          variant="blue"
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'CREATING...' : 'REGISTER'}
        </ArcadeButton>
      </form>
    </div>
  );
}
