import { render, screen, fireEvent } from '@testing-library/react';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import React from 'react';

describe('ContextMenu', () => {
  it('shows menu item after contextmenu event', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Menu Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    const trigger = screen.getByText('Right click me');
    fireEvent.contextMenu(trigger);
    expect(screen.getByText('Menu Item')).toBeInTheDocument();
  });
});
