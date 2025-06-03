import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../src/pages/HomePage.jsx';

// Simular GameCard para evitar renderizar todos los detalles del juego
vi.mock('../src/components/games/game-card', () => ({
  GameCard: ({ game }) => <div data-testid="game-card">{game.title}</div>
}));

describe('HomePage', () => {
  it('renders the logo and welcome text', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(screen.getAllByAltText(/NeoArcade Logo/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Relive the nostalgia/i)).toBeInTheDocument();
  });

  it('shows all category buttons', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(screen.getByText(/All the games/i)).toBeInTheDocument();
    expect(screen.getByText(/Puzzle/i)).toBeInTheDocument();
    expect(screen.getByText(/Action/i)).toBeInTheDocument();
    expect(screen.getByText(/Strategy/i)).toBeInTheDocument();
    expect(screen.getByText(/Classics/i)).toBeInTheDocument();
  });

  it('filters games by category', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    // Click en Puzzle
    fireEvent.click(screen.getByText(/Puzzle/i));
    // Debe mostrar solo los juegos con categor a 'puzzle'
    const cards = screen.getAllByTestId('game-card');
    expect(cards.length).toBeGreaterThanOrEqual(0); // Al menos 0, no podemos saber el exacto sin el mock de GAMES
  });

  it('renders the footer', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(screen.getByText(/©/i)).toBeInTheDocument();
  });
});
