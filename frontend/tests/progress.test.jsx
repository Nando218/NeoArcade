import { render } from '@testing-library/react';
import { Progress } from '../src/components/ui/progress';
import React from 'react';

describe('Progress', () => {
  it('renders Progress component', () => {
    const { container } = render(<Progress value={50} />);
    expect(container).toBeInTheDocument();
  });
});
