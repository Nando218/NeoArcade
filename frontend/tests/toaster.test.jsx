import { render } from '@testing-library/react';
import { Toaster } from '@/components/ui/toaster';

describe('Toaster', () => {
  it('renders Toaster', () => {
    render(<Toaster />);
  });
});
