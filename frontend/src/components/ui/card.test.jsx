import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';
import React from 'react';

describe('Card', () => {
  it('renders Card with children', () => {
    render(<Card>Content</Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders CardHeader, CardTitle, CardDescription, CardContent, CardFooter', () => {
    render(
      <Card>
        <CardHeader>Header</CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description</CardDescription>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
