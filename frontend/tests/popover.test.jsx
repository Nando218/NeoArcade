import { render } from '@testing-library/react';
import { Popover } from '../src/components/ui/popover';
import React from 'react';

describe('Popover', () => {
  it('renders Popover component', () => {
    const { container } = render(<Popover />);
    expect(container).toBeInTheDocument();
  });
});
