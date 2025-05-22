import { render } from '@testing-library/react';
import { Menubar } from '../src/components/ui/menubar';
import React from 'react';

describe('Menubar', () => {
  it('renders Menubar component', () => {
    const { container } = render(<Menubar />);
    expect(container).toBeInTheDocument();
  });
});
