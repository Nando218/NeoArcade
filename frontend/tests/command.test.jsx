import { render, screen } from '@testing-library/react';
import { CommandDialog, CommandInput, CommandList, CommandItem } from '@/components/ui/command';
import React from 'react';

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  // Mock scrollIntoView for all elements
  if (!HTMLElement.prototype.scrollIntoView) {
    HTMLElement.prototype.scrollIntoView = function () {};
  }
});

describe('Command', () => {
  it('renders dialog with input and item', () => {
    render(
      <CommandDialog open>
        <CommandInput placeholder="Type..." />
        <CommandList>
          <CommandItem>Item 1</CommandItem>
        </CommandList>
      </CommandDialog>
    );
    expect(screen.getByPlaceholderText('Type...')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });
});
