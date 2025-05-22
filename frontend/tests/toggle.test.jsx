import { render } from '@testing-library/react';
import { Toggle } from '@/components/ui/toggle';

describe('Toggle', () => {
  it('renders toggle button', () => {
    const { container } = render(<Toggle>Toggle</Toggle>);
    expect(container).toBeInTheDocument();
  });
});
