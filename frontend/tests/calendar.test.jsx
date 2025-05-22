import { render } from '@testing-library/react';
import { Calendar } from '../src/components/ui/calendar';
import React from 'react';

describe('Calendar', () => {
  it('renders Calendar component', () => {
    const { container } = render(<Calendar />);
    expect(container).toBeInTheDocument();
  });
});
