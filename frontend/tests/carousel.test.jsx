import { render } from '@testing-library/react';
import { Carousel } from '@/components/ui/carousel';

describe('Carousel', () => {
  it('renders', () => {
    render(
      <Carousel>
        <div>Item</div>
      </Carousel>
    );
  });
});
