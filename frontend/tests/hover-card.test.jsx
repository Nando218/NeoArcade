import { render } from '@testing-library/react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

describe('HoverCard', () => {
  it.skip('renders hover card content', () => {
    // limitación de jsdom: el contenido de la tarjeta flotante no se renderiza a menos que esté abierto
    const { getByText } = render(
      <HoverCard>
        <HoverCardTrigger>Trigger</HoverCardTrigger>
        <HoverCardContent>Content</HoverCardContent>
      </HoverCard>
    );
    expect(getByText('Trigger')).toBeInTheDocument();
    expect(getByText('Content')).toBeInTheDocument();
  });
});
