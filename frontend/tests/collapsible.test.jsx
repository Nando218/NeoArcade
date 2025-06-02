import { render, screen, fireEvent } from '@testing-library/react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import React from 'react';

describe('Collapsible', () => {
  it('shows content after trigger click', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Open</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    const trigger = screen.getByText('Open');
    fireEvent.click(trigger);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
