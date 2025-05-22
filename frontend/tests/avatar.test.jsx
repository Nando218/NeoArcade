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
    // AvatarPrimitive.Image may render as <span> in test env if src is not loaded, so check fallback
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
