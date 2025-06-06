import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  IconButton,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  InputAdornment
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';

// Sample data - replace with actual data from your backend
const sampleEmployees = [
  {
    id: 1,
    startDate: '2024-01-01',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    department: 'Phòng nghiệp vụ',
    position: 'Công chứng viên',
    status: 'active'
  },
  {
    id: 2,
    startDate: '2024-02-01',
    name: 'Trần Thị B',
    email: 'tranthib@gmail.com',
    department: 'Phòng kế toán',
    position: 'Kế toán',
    status: 'active'
  },
  {
    id: 3,
    startDate: '2024-03-01',
    name: 'Lê Văn C',
    email: 'levanc@gmail.com',
    department: 'Phòng hành chính',
    position: 'Nhân viên',
    status: 'deactive'
  },
];

const departments = [
  'Tất cả phòng ban',
  'Phòng nghiệp vụ',
  'Phòng kế toán',
  'Phòng hành chính'
];

const Employees = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [department, setDepartment] = useState('Tất cả phòng ban');

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = sampleEmployees.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 4,
          width: '80%'
        }}
      >
        <Paper sx={{ width: '100%', mb: 2 }}>
          {/* Table Toolbar */}
          <Box sx={{ p: 2 }}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" spacing={2}>
                <TextField
                  placeholder="Tìm kiếm theo tên"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 250 }}
                />
                <FormControl sx={{ width: 200 }}>
                  <InputLabel id="department-filter-label">Phòng ban</InputLabel>
                  <Select
                    labelId="department-filter-label"
                    value={department}
                    label="Phòng ban"
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {/* Handle add employee */}}
              >
                Thêm nhân viên
              </Button>
            </Stack>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={selected.length > 0 && selected.length < sampleEmployees.length}
                      checked={selected.length === sampleEmployees.length}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell>STT</TableCell>
                  <TableCell>Ngày bắt đầu</TableCell>
                  <TableCell>Họ tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phòng ban</TableCell>
                  <TableCell>Chức vụ</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sampleEmployees
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onChange={(event) => handleClick(event, row.id)}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{row.startDate}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.department}</TableCell>
                        <TableCell>{row.position}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.status === 'active' ? 'Hoạt động' : 'Đã ngưng'}
                            color={row.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <IconButton 
                              size="small" 
                              sx={{ 
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'primary.dark' }
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              sx={{ 
                                bgcolor: 'success.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'success.dark' }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              sx={{ 
                                bgcolor: 'error.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'error.dark' }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sampleEmployees.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default Employees;