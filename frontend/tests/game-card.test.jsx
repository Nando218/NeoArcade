import { render, screen } from '@testing-library/react';
import { GameCard } from '../src/components/games/game-card';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

describe('GameCard', () => {
  const game = {
    id: 'tetris',
    name: 'Tetris',
    category: 'puzzle',
    description: 'Classic puzzle game',
    path: '/games/tetris',
  };

  it('renders game name and description', () => {
    render(
      <MemoryRouter>
        <GameCard game={game} />
      </MemoryRouter>
    );
    const tetrisElements = screen.getAllByText('Tetris');
    expect(tetrisElements.length).toBeGreaterThan(0);
    expect(screen.getByText('Classic puzzle game')).toBeInTheDocument();
  });

  it('renders PLAY button', () => {
    render(
      <MemoryRouter>
        <GameCard game={game} />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
  });
});
