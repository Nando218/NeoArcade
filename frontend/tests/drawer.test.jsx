import { render } from '@testing-library/react';
import { Drawer } from '../src/components/ui/drawer';
import React from 'react';

describe('Drawer', () => {
  it('renders Drawer component', () => {
    const { container } = render(<Drawer />);
    expect(container).toBeInTheDocument();
  });
});
