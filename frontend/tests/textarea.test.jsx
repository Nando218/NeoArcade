import { render } from '@testing-library/react';
import { Textarea } from '@/components/ui/textarea';

describe('Textarea', () => {
  it('renders a textarea', () => {
    const { getByRole } = render(<Textarea placeholder="Type here..." />);
    expect(getByRole('textbox')).toBeInTheDocument();
  });
});
