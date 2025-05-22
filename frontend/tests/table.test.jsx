import { render } from '@testing-library/react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@/components/ui/table';

describe('Table', () => {
  it('renders a table with header, body, and caption', () => {
    const { getByText, getByRole } = render(
      <Table>
        <TableCaption>Test Caption</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(getByText('Test Caption')).toBeInTheDocument();
    expect(getByText('Header')).toBeInTheDocument();
    expect(getByText('Cell')).toBeInTheDocument();
    expect(getByRole('table')).toBeInTheDocument();
  });
});
