import { render } from '@testing-library/react';
import { Pagination } from '@/components/ui/pagination';

describe('Pagination', () => {
  it('renders pagination', () => {
    const { container } = render(<Pagination total={10} current={1} onPageChange={() => {}} />);
    expect(container).toBeInTheDocument();
  });
});
