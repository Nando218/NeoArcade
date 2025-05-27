import axios from 'axios';

// Create axios instance with improved error handling
const api = axios.create({
  // Usar URL relativa para que funcione con el proxy de Vite
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  // Add timeout to prevent hanging requests
  timeout: 8000 
});

// Add response interceptor for better error logging
api.interceptors.response.use(
  response => response,
  error => {
    // Log detailed error information
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    return Promise.reject(error);
  }
);

// Add authorization header interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('arcade-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: async (username, email, password) => {
    try {
      console.log('Sending registration request:', { username, email });
      const response = await api.post('/auth/register', { username, email, password });
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.message);
      console.error('Server response:', error.response?.data);
      throw error;
    }
  },
  
  login: async (email, password) => {
    try {
      console.log('Sending login request:', { email });
      const response = await api.post('/auth/login', { email, password });
      console.log('Login successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.message);
      console.error('Server response:', error.response?.data);
      throw error;
    }
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  // Admin functions
  getAllUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },
  
  deleteUser: async (userId) => {
    const response = await api.delete(`/auth/users/${userId}`);
    return response.data;
  },
  
  updateUserRole: async (userId, role) => {
    const response = await api.patch(`/auth/users/${userId}/role`, { role });
    return response.data;
  }
};

// Score API
export const scoreAPI = {
  getAllScores: async () => {
    console.log('Fetching all scores');
    const response = await api.get('/scores');
    console.log('Scores received:', response.data);
    return response.data;
  },
  
  getGameScores: async (gameId, limit) => {
    console.log(`Fetching scores for game ${gameId} with limit ${limit}`);
    const response = await api.get(`/scores/game/${gameId}${limit ? `?limit=${limit}` : ''}`);
    console.log('Game scores received:', response.data);
    return response.data;
  },
  
  getUserScores: async (userId) => {
    console.log(`Fetching scores for user ${userId}`);
    const response = await api.get(`/scores/user/${userId}`);
    console.log('User scores received:', response.data);
    return response.data;
  },
  
  addScore: async (gameId, points) => {
    console.log(`Adding score for game ${gameId}: ${points} points`);
    const response = await api.post('/scores', { gameId, points });
    console.log('Score added response:', response.data);
    return response.data;
  },
  
  deleteScore: async (scoreId) => {
    const response = await api.delete(`/scores/${scoreId}`);
    return response.data;
  }
};

// Game API
export const gameAPI = {
  getAllGames: async () => {
    const response = await api.get('/games');
    return response.data;
  },
  
  getGame: async (id) => {
    const response = await api.get(`/games/${id}`);
    return response.data;
  },
  
  addGame: async (gameData) => {
    const response = await api.post('/games', gameData);
    return response.data;
  },
  
  updateGame: async (id, gameData) => {
    const response = await api.put(`/games/${id}`, gameData);
    return response.data;
  },
  
  deleteGame: async (id) => {
    const response = await api.delete(`/games/${id}`);
    return response.data;
  }
};

export default api;
