import { render } from '@testing-library/react';
import { ScrollArea } from '@/components/ui/scroll-area';

describe('ScrollArea', () => {
  it('renders scroll area', () => {
    const { container } = render(
      <ScrollArea style={{ height: 100 }}>
        <div style={{ height: 200 }}>Content</div>
      </ScrollArea>
    );
    expect(container).toBeInTheDocument();
  });
});
