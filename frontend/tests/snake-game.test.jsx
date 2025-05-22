import { render, screen } from '@testing-library/react';
import React from 'react';
import { SnakeGame } from '../src/games/snake/snake-game';

vi.mock('../src/lib/auth', () => ({ useAuth: () => ({ isAuthenticated: true }) }));
vi.mock('../src/lib/scores', () => ({ useScores: () => ({ addScore: vi.fn() }) }));
vi.mock('../src/hooks/use-mobile', () => ({ useIsMobile: () => false }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() } }));

describe('SnakeGame', () => {
  it('renders without crashing and shows Start button', () => {
    render(<SnakeGame />);
    expect(screen.getByText(/start/i)).toBeInTheDocument();
  });

  it('shows score', () => {
    render(<SnakeGame />);
    expect(screen.getByText(/score/i)).toBeInTheDocument();
  });
});
