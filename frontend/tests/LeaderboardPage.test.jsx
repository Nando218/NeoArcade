import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LeaderboardPage from '../src/pages/LeaderboardPage.jsx';

describe('LeaderboardPage', () => {
  it('renders leaderboard title', () => {
    render(<MemoryRouter><LeaderboardPage /></MemoryRouter>);
    expect(screen.getByText(/leaderboard/i)).toBeInTheDocument();
  });
});
