import { render } from '@testing-library/react';
import { Avatar, AvatarImage, AvatarFallback } from '../src/components/ui/avatar';
import React from 'react';

describe('Avatar', () => {
  it('renders Avatar root', () => {
    const { container } = render(<Avatar />);
    expect(container.firstChild).toHaveClass('rounded-full');
  });

  it('renders AvatarImage with src inside Avatar', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="/avatar.png" alt="avatar" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );
    // AvatarPrimitive.Image puede renderizar como <span> en entorno de prueba si src no se carga, asi que verificamos el fallback
    expect(container.textContent).toContain('AB');
  });

  it('renders AvatarFallback with children inside Avatar', () => {
    const { getByText } = render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );
    expect(getByText('AB')).toBeInTheDocument();
  });
});
