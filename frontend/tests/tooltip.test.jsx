import { render, screen, fireEvent } from '@testing-library/react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import React from 'react';

describe('Tooltip', () => {
  it('renders tooltip trigger', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows tooltip content on trigger focus', async () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    const trigger = screen.getByText('Hover me');
    fireEvent.focus(trigger);
    // Puede haber más de un nodo con el mismo texto, solo verifica que al menos uno esté visible
    const tooltips = await screen.findAllByText('Tooltip text');
    expect(tooltips.length).toBeGreaterThan(0);
    expect(tooltips[0]).toBeInTheDocument();
  });

  // it('shows tooltip content on hover', async () => {
  //   render(
  //     <TooltipProvider>
  //       <Tooltip>
  //         <TooltipTrigger>Hover me</TooltipTrigger>
  //         <TooltipContent>Tooltip text</TooltipContent>
  //       </Tooltip>
  //     </TooltipProvider>
  //   );
  //   const trigger = screen.getByText('Hover me');
  //   fireEvent.mouseOver(trigger);
  //   const tooltips = await screen.findAllByText('Tooltip text');
  //   expect(tooltips.length).toBeGreaterThan(0);
  //   expect(tooltips[0]).toBeInTheDocument();
  // });
  // Nota: Este test no es compatible con JSDOM + Radix UI overlays

  it('hides tooltip content on blur', async () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    const trigger = screen.getByText('Hover me');
    fireEvent.focus(trigger);
    let tooltips = await screen.findAllByText('Tooltip text');
    expect(tooltips.length).toBeGreaterThan(0);
    fireEvent.blur(trigger);
    // Espera a que desaparezca
    expect(screen.queryByText('Tooltip text')).toBeNull();
  });

  it('has correct accessibility attributes', async () => {
    render(
      <TooltipProvider>
        <Tooltip open={true}>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    const trigger = screen.getByText('Hover me');
    // Busca el nodo con role="tooltip"
    const tooltips = screen.getAllByText('Tooltip text').filter(el => el.getAttribute('role') === 'tooltip');
    expect(tooltips.length).toBeGreaterThan(0);
    const tooltip = tooltips[0];
    expect(tooltip).toHaveAttribute('role', 'tooltip');
    // aria-describedby
    const describedBy = trigger.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(tooltip.id).toBe(describedBy);
  });
});
