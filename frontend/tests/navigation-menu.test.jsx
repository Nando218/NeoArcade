import { render } from '@testing-library/react';
import { NavigationMenu } from '../src/components/ui/navigation-menu';
import React from 'react';

describe('NavigationMenu', () => {
  it('renders NavigationMenu component', () => {
    const { container } = render(<NavigationMenu />);
    expect(container).toBeInTheDocument();
  });
});
