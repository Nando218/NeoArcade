import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Index from '../src/pages/Index.jsx';

describe('Index Page', () => {
  it('renders index page', () => {
    render(<MemoryRouter><Index /></MemoryRouter>);
    expect(screen.getByText(/Relive the nostalgia/i)).toBeInTheDocument();
  });
});
