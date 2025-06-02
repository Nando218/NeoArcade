import { render } from '@testing-library/react';
import { Leaderboard } from '../../src/components/scores/leaderboard';
import React from 'react';

describe('Leaderboard', () => {
  it('renders without crashing', () => {
    const { container } = render(<Leaderboard />);
    expect(container).toBeInTheDocument();
  });
  // Add more tests for filtering, loading, and error states if needed
});
