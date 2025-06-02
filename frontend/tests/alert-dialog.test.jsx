import { render, screen, fireEvent } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from '../src/components/ui/alert';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader } from '@/components/ui/alert-dialog';
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

describe('AlertDialog', () => {
  it('renders trigger and content after open', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>Dialog Title</AlertDialogHeader>
          <div>Dialog Content</div>
        </AlertDialogContent>
      </AlertDialog>
    );
    const trigger = screen.getByText('Open Dialog');
    fireEvent.click(trigger);
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog Content')).toBeInTheDocument();
  });
});
