
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from './api';

// Clear any possibly corrupted auth data from localStorage
try {
  if (typeof window !== 'undefined') {
    const currentData = localStorage.getItem('arcade-auth-storage');
    if (currentData) {
      console.log('Found existing auth data, checking validity...');
      try {
        JSON.parse(currentData);
        console.log('Auth data is valid JSON');
      } catch (e) {
        console.warn('Auth data is corrupted, clearing it');
        localStorage.removeItem('arcade-auth-storage');
      }
    }
  }
} catch (e) {
  console.error('Error checking localStorage:', e);
}

export const useAuth = create()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      
      login: async (email, password) => {
        set({ isLoading: true });
        
        try {
          console.log('Attempting login with:', { email });
          
          if (!email || !password) {
            console.error('Login failed: Missing email or password');
            set({ isLoading: false });
            return false;
          }
          
          const data = await authAPI.login(email, password);
          
          if (!data || !data.token || !data.user) {
            console.error('Login failed: Invalid response from server', data);
            set({ isLoading: false });
            return false;
          }
          
          // Store token in localStorage for API interceptor
          localStorage.setItem('arcade-token', data.token);
          
          set({ 
            user: data.user, 
            token: data.token,
            isAuthenticated: true, 
            isLoading: false 
          });
          
          console.log('Login successful, user data:', data.user);
          return true;
        } catch (error) {
          console.error('Login failed:', error);
          console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
          set({ isLoading: false });
          return false;
        }
      },
      
      register: async (username, email, password) => {
        set({ isLoading: true });
        
        try {
          if (!username || !email || !password) {
            console.error('Registration failed: Missing required fields');
            set({ isLoading: false });
            return false;
          }
          
          console.log('Sending registration request with:', { username, email });
          const data = await authAPI.register(username, email, password);
          
          if (!data || !data.token || !data.user) {
            console.error('Registration failed: Invalid response from server', data);
            set({ isLoading: false });
            return false;
          }
          
          // Store token in localStorage for API interceptor
          localStorage.setItem('arcade-token', data.token);
          
          set({ 
            user: data.user, 
            token: data.token,
            isAuthenticated: true, 
            isLoading: false 
          });
          
          console.log('Registration successful, user data:', data.user);
          return true;
        } catch (error) {
          console.error('Registration failed:', error);
          console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
          set({ isLoading: false });
          return false;
        }
      },
      
      logout: () => {
        localStorage.removeItem('arcade-token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      refreshProfile: async () => {
        if (!get().token) return;
        
        try {
          const data = await authAPI.getProfile();
          set({ user: data.user });
        } catch (error) {
          console.error('Failed to refresh profile:', error);
          // If token is invalid, logout
          if (error?.response?.status === 401) {
            get().logout();
          }
        }
      }
    }),
    {
      name: 'arcade-auth-storage',
      storage: {
        getItem: name => {
          try {
            return localStorage.getItem(name);
          } catch (err) {
            console.error('Error reading from localStorage:', err);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value);
          } catch (err) {
            console.error('Error writing to localStorage:', err);
          }
        },
        removeItem: name => {
          try {
            localStorage.removeItem(name);
          } catch (err) {
            console.error('Error removing from localStorage:', err);
          }
        }
      },
      // Only persist these specific fields
      partialize: state => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
