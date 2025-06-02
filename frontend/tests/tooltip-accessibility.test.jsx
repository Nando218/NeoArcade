import { render } from '@testing-library/react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import React from 'react';

describe('Tooltip accessibility', () => {
  it('TooltipContent has role tooltip y está vinculado al trigger por aria-describedby', () => {
    // Forzamos el estado abierto del tooltip para que el contenido se renderice en JSDOM
    const { getAllByText, getByRole } = render(
      <TooltipProvider>
        <Tooltip open={true}>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Tooltip info</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    // Radix UI renderiza el texto dos veces: uno visible y otro oculto con role="tooltip" para accesibilidad
    const tooltips = getAllByText('Tooltip info');
    // Buscamos el elemento con role="tooltip"
    const tooltip = tooltips.find(el => el.getAttribute('role') === 'tooltip');
    expect(tooltip).toBeTruthy();
    // Verificamos que el trigger está vinculado por aria-describedby
    const trigger = getByRole('button');
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id);
  });
});
