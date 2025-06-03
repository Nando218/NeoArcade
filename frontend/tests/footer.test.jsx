import { render, screen, fireEvent } from '@testing-library/react';
import { Footer } from '../src/components/layout/footer';
import React from 'react';

describe('Footer', () => {
  it('renders Footer component', () => {
    const { container } = render(<Footer />);
    expect(container).toBeInTheDocument();
  });

  it('renders social links with correct hrefs', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link');
    expect(links.some(link => link.getAttribute('href')?.includes('github.com'))).toBe(true);
    expect(links.some(link => link.getAttribute('href')?.includes('linkedin.com'))).toBe(true);
    expect(links.some(link => link.getAttribute('href')?.includes('instagram.com'))).toBe(true);
  });

  it('renders contact form button and opens dialog', () => {
    render(<Footer />);
    const mailButton = screen.getByRole('button', { hidden: true }); 
    expect(mailButton).toBeInTheDocument();
    fireEvent.click(mailButton);
    expect(screen.getByText(/any suggestions or comments/i)).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/rewind arcade/i)).toBeInTheDocument();
    expect(screen.getByText(/all right reserved/i)).toBeInTheDocument();
  });
});
