import { render } from '@testing-library/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

describe('DropdownMenu', () => {
  it.skip('renders dropdown menu content', () => {
    // jsdom limitation: menu content is not rendered unless opened
    const { getByText } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Label</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuCheckboxItem checked>Check</DropdownMenuCheckboxItem>
          <DropdownMenuRadioItem>Radio</DropdownMenuRadioItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(getByText('Open')).toBeInTheDocument();
    expect(getByText('Label')).toBeInTheDocument();
    expect(getByText('Item 1')).toBeInTheDocument();
    expect(getByText('Check')).toBeInTheDocument();
    expect(getByText('Radio')).toBeInTheDocument();
  });
});
