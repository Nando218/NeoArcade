import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../src/pages/NotFound.jsx';

describe('NotFound Page', () => {
  it('renders not found message', () => {
    render(<MemoryRouter><NotFound /></MemoryRouter>);
    // Use getAllByText and check at least one matches
    const matches = screen.getAllByText(/página no encontrada|not found/i);
    expect(matches.length).toBeGreaterThan(0);
  });
});
