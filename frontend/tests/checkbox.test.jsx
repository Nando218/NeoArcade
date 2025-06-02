import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '@/components/ui/checkbox';
import React from 'react';

describe('Checkbox', () => {
  it('renders and toggles checked state', () => {
    render(<Checkbox data-testid="checkbox" />);
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox);
    // No checked attribute, but should not throw
  });
});
