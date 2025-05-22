import { render } from '@testing-library/react';
import { Separator } from '../src/components/ui/separator';
import React from 'react';

describe('Separator', () => {
  it('renders Separator component', () => {
    const { container } = render(<Separator />);
    expect(container).toBeInTheDocument();
  });
});
