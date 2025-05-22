import { render } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from '../src/components/ui/alert';
import React from 'react';

describe('Alert', () => {
  it('renders Alert component', () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Test Title</AlertTitle>
        <AlertDescription>Test Description</AlertDescription>
      </Alert>
    );
    expect(container).toBeInTheDocument();
  });
  it('renders AlertTitle and AlertDescription', () => {
    const { getByText } = render(
      <Alert>
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>Something happened</AlertDescription>
      </Alert>
    );
    expect(getByText('Important')).toBeInTheDocument();
    expect(getByText('Something happened')).toBeInTheDocument();
  });
});
