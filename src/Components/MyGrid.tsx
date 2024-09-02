import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow'
import { Tooltip } from '@mui/material';

const Grid = (props: any) => {
  const { data, columns } = props
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    event;
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    data == null ? <h1>No Records Added Yet!</h1> : (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: "70vh" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column: any) => (
                  <TableCell style={{ minWidth: column.minWidth }} className='bg-darkBlue text-white fw-bold fs-6' key={column.id}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: any, index: any) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column: any) => {
                        const value = column.render ? column.render(row) : row[column.id];
                        return (
                          <TableCell className='fs-6' key={column.id}>
                            {column.isAction && column.id === 'actions' ? (
                              <>
                                {column.render(row)}
                              </>
                            ) : (
                              Array.isArray(value) ? 
                              (value.join(", ").length > 19 ? 
                                (<Tooltip title={value.join(", ")} placement="top" arrow><span>{value.join(", ").slice(0, 19)}...</span></Tooltip>) 
                                : value.join(", ")) 
                              : value.length > 19 ? <Tooltip title={value} placement="top" arrow><span>{value.slice(0, 19)}...</span></Tooltip> : <span>{value}</span>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    )
  );
}

export default Grid;