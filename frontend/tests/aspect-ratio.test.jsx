import { render } from '@testing-library/react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import React from 'react';

describe('AspectRatio', () => {
  it('renders children inside the aspect ratio container', () => {
    const { getByAltText } = render(
      <AspectRatio ratio={16 / 9}>
        <img src="test.jpg" alt="test-img" />
      </AspectRatio>
    );
    expect(getByAltText('test-img')).toBeInTheDocument();
  });
});
