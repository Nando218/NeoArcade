
import { create } from 'zustand';
import { scoreAPI } from './api';

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
      const response = await scoreAPI.addScore(gameId, points);
      const normalizedScore = normalizeScore(response.score);
      
      set((state) => ({
        scores: [normalizedScore, ...state.scores],
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to add score:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to add score' 
      });
      return false;
    }
  },
  
  fetchScoresByGame: async (gameId, limit) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await scoreAPI.getGameScores(gameId, limit);
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
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch game scores' 
      });
      return [];
    }
  },
  
  fetchUserScores: async (userId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await scoreAPI.getUserScores(userId.toString());
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
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch user scores' 
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
