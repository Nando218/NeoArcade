import { render } from '@testing-library/react';
import React from 'react';
import BackgroundPattern from '../src/components/layout/background-pattern';

describe('BackgroundPattern', () => {
  it('renders without crashing', () => {
    render(<BackgroundPattern />);
  });
});
