import { render } from '@testing-library/react';
import { Label } from '@/components/ui/label';

describe('Label', () => {
  it('renders a label', () => {
    const { getByText } = render(<Label>Test Label</Label>);
    expect(getByText('Test Label')).toBeInTheDocument();
  });
});
