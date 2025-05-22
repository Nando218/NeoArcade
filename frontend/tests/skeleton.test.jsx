import { render } from '@testing-library/react';
import { Skeleton } from '../src/components/ui/skeleton';
import React from 'react';

describe('Skeleton', () => {
  it('renders Skeleton component', () => {
    const { container } = render(<Skeleton />);
    expect(container).toBeInTheDocument();
  });
});
