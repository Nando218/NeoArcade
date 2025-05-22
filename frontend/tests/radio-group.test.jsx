import { render } from '@testing-library/react';
import { RadioGroup } from '@/components/ui/radio-group';

describe('RadioGroup', () => {
  it('renders radio group', () => {
    const { container } = render(
      <RadioGroup>
        <input type="radio" value="1" />
        <input type="radio" value="2" />
      </RadioGroup>
    );
    expect(container.querySelectorAll('input[type="radio"]').length).toBe(2);
  });
});
