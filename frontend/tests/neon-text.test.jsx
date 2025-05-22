import { render } from '@testing-library/react';
import { NeonText } from '@/components/ui/neon-text';

describe('NeonText', () => {
  it('renders neon text with children', () => {
    const { getByText } = render(<NeonText color="blue">Arcade</NeonText>);
    expect(getByText('Arcade')).toBeInTheDocument();
  });
});
