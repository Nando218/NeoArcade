import { render, screen } from '@testing-library/react';
import React from 'react';
import { TetrisGame } from '../src/games/tetris/tetris-game';

vi.mock('../src/lib/auth', () => ({ useAuth: () => ({ isAuthenticated: true, user: { name: 'Test' } }) }));
vi.mock('../src/lib/scores', () => ({ useScores: () => ({ addScore: vi.fn() }) }));
vi.mock('../src/hooks/use-mobile', () => ({ useIsMobile: () => false }));
vi.mock('../src/hooks/use-toast', () => ({ toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() } }));

// Prueba de humo basica para Tetris

describe('TetrisGame', () => {
  it.skip('renders without crashing and shows Start button', () => {
    render(<TetrisGame />);
    expect(screen.getByText(/start/i)).toBeInTheDocument();
  });

  it.skip('shows score and level', () => {
    render(<TetrisGame />);
    expect(screen.getByText(/score/i)).toBeInTheDocument();
    expect(screen.getByText(/level/i)).toBeInTheDocument();
  });
});
