
import { create } from 'zustand';
import { scoreAPI } from './api';
import { toast } from "@/hooks/use-toast";

// Normalización de datos de la API
const normalizeScore = (apiScore) => ({
  id: apiScore.id,
  userId: apiScore.userId || apiScore.user_id,
  username: apiScore.username,
  gameId: apiScore.gameId || apiScore.game_id,
  points: apiScore.points,
  date: apiScore.date
});

export const useScores = create((set, get) => ({
  scores: [],
  isLoading: false,
  error: null,
  
  addScore: async ({ gameId, points }) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log(`Trying to add score: gameId=${gameId}, points=${points}`);
      const response = await scoreAPI.addScore(gameId, points);
      console.log('Score added successfully:', response);
      
      const normalizedScore = normalizeScore(response.score);
      
      set((state) => ({
        scores: [normalizedScore, ...state.scores],
        isLoading: false
      }));
      
      toast({
        title: "¡Puntuación guardada!",
        description: `Se han registrado ${points} puntos en ${gameId}.`,
      });
      
      return true;
    } catch (error) {
      console.error('Failed to add score:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Error al guardar la puntuación';
      
      set({ 
        isLoading: false, 
        error: errorMessage
      });
      
      toast({
        title: "Error al guardar puntuación",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  },
  
  fetchScoresByGame: async (gameId, limit) => {
    set(state => ({ 
      ...state,
      isLoading: true, 
      error: null 
    }));
    
    try {
      console.log(`Fetching scores for game: ${gameId}, limit: ${limit}`);
      const response = await scoreAPI.getGameScores(gameId, limit);
      console.log('Received scores:', response);
      
      if (!response.scores || !Array.isArray(response.scores)) {
        throw new Error('Invalid response format: scores array is missing');
      }
      
      const normalizedScores = response.scores.map(normalizeScore);
      
      set((state) => {
        // Merge with existing scores
        const existingScoreIds = new Set(state.scores.map(s => s.id));
        const newScores = normalizedScores.filter(s => !existingScoreIds.has(s.id));
        
        return {
          scores: [...state.scores, ...newScores],
          isLoading: false
        };
      });
      
      return normalizedScores;
    } catch (error) {
      console.error('Failed to fetch game scores:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Error al cargar las puntuaciones';
      
      set({ 
        isLoading: false, 
        error: errorMessage
      });
      
      toast({
        title: "Error de carga",
        description: errorMessage,
        variant: "destructive",
      });
      
      return [];
    }
  },
  
  fetchUserScores: async (userId) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log(`Fetching scores for user: ${userId}`);
      const response = await scoreAPI.getUserScores(userId.toString());
      console.log('Received user scores:', response);
      
      if (!response.scores || !Array.isArray(response.scores)) {
        throw new Error('Invalid response format: scores array is missing');
      }
      
      const normalizedScores = response.scores.map(normalizeScore);
      
      set((state) => {
        // Merge with existing scores
        const existingScoreIds = new Set(state.scores.map(s => s.id));
        const newScores = normalizedScores.filter(s => !existingScoreIds.has(s.id));
        
        return {
          scores: [...state.scores, ...newScores],
          isLoading: false
        };
      });
      
      return normalizedScores;
    } catch (error) {
      console.error('Failed to fetch user scores:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Error al cargar las puntuaciones del usuario';
      
      set({ 
        isLoading: false, 
        error: errorMessage
      });
      
      toast({
        title: "Error de carga",
        description: errorMessage,
        variant: "destructive",
      });
      
      return [];
    }
  },
  
  getScoresByGame: (gameId) => {
    return get().scores
      .filter(score => score.gameId === gameId)
      .sort((a, b) => b.points - a.points);
  },
  
  getTopScoresByGame: (gameId, limit = 10) => {
    return get().scores
      .filter(score => score.gameId === gameId)
      .sort((a, b) => b.points - a.points)
      .slice(0, limit);
  },
  
  getUserScores: (userId) => {
    return get().scores
      .filter(score => score.userId.toString() === userId.toString())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}));
