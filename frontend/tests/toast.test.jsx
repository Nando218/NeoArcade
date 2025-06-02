import { render } from '@testing-library/react';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';

describe('ToastProvider', () => {
  it('renders ToastProvider', () => {
    render(
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
    );
  });
});
