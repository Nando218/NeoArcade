import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';
import React from 'react';

describe('Accordion', () => {
  it('renders Accordion with items', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText('Trigger 1')).toBeInTheDocument();
  });

  it('shows content when trigger is clicked', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const trigger = screen.getByText('Trigger 1');
    fireEvent.click(trigger);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });
});
