// EmployeeIndex.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import Search from '../../Search Option/Search';
import config from '../../../config';
import AddEmployee from './AddEmployee';
import UpdateEmployee from './UpdateEmployee';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { format } from 'date-fns';

function EmployeeIndex() {
  const [empData, setEmpData] = useState([]);
  const [filteredEmpData, setFilteredEmpData] = useState([]);
  const [errmsg, setErrMsg] = useState('');
  const [openErrDialog, setOpenErrDialog] = useState(false);
  const [addNewEmp, setAddNewEmp] = useState(false);
  const [openDltDialog, setOpenDltDialog] = useState(false);
  const [dltData, setDltData] = useState();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateData, setUpdateData] = useState();
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios
      .get(`${config.apiUrl}/employee/`)
      .then((res) => {
        setEmpData(res.data);
        setFilteredEmpData(res.data);
      })
      .catch((err) => {
        const errorMessage = err.response ? err.response.data.message : err.message;
        setErrMsg(errorMessage);
        setOpenErrDialog(true);
      });
  }, [openDltDialog, addNewEmp, openUpdateDialog]);

  const handleEdit = (id) => {
    const updateEmp = empData.find((emp) => emp.emp_id === id);
    if (updateEmp) {
      setUpdateData(updateEmp);
      setOpenUpdateDialog(true); // Ensure this line is present
    }
  };

  const handleDlt = (id) => {
    setDltData(id);
    setOpenDltDialog(true);
  };

  const confirmDlt = () => {
    axios
      .delete(`${config.apiUrl}/employee/delete/${dltData}`)
      .then((res) => {
        setOpenDltDialog(false);
      })
      .catch((err) => {
        setOpenDltDialog(false);
        setOpenErrDialog(true);
        setErrMsg('Error deleting data. Please try again later.');
      });
  };

  const handleChangeDataPerPage = (e) => {
    const newDataPerPage = parseInt(e.target.value, 10);
    if (newDataPerPage == 1) {
      setDataPerPage(empData.length);
      setCurrentPage(1);
    } else {
      setDataPerPage(newDataPerPage);
      setCurrentPage(1);
    }
  };

  const firstIndexOfData = (currentPage - 1) * dataPerPage;
  const lastIndexOfData = currentPage * dataPerPage;
  const currentData = filteredEmpData.slice(firstIndexOfData, lastIndexOfData);

  return (
    <>
      <h1 className="text-center">Employee Index</h1>
      <Grid container spacing={2} className="mt-2">
        <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center', height: '50%' }}>
          <Button onClick={() => setAddNewEmp(true)}>Add New Employee</Button>
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Search data={empData} setData={setFilteredEmpData} />
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <FormControl>
            <Select value={dataPerPage} onChange={handleChangeDataPerPage}>
              <MenuItem value={5}>5 Per Page</MenuItem>
              <MenuItem value={10}>10 Per Page</MenuItem>
              <MenuItem value={15}>15 Per Page</MenuItem>
              <MenuItem value={1}>All Per Page</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <TableContainer component={Paper} className="mt-3">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>S.no</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Mobile</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Language</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Department</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Role</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>State</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>District</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>City</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((emp, index) => (
              <TableRow key={emp.emp_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{emp.emp_name}</TableCell>
                <TableCell>{emp.emp_email}</TableCell>
                <TableCell>{emp.emp_mobile}</TableCell>
                <TableCell>{emp.language_name}</TableCell>
                <TableCell>{emp.dept_name}</TableCell>
                <TableCell>{emp.role}</TableCell>
                <TableCell>{emp.state}</TableCell>
                <TableCell>{format(new Date(emp.created_at), 'dd/MM/yyyy')}</TableCell> {/* Format the date */}
                <TableCell>{emp.dist}</TableCell>
                <TableCell>{emp.city}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(emp.emp_id)}>Edit</Button>
                  <Button onClick={() => handleDlt(emp.emp_id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={2} display="flex" justifyContent="center" className="mt-4">
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(empData.length / dataPerPage)}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            size="small"
            style={{ cursor: 'pointer', '&:hover': { backgroundColor: 'transparent' } }}
          />
        </Stack>
      </Grid>

      <Dialog open={addNewEmp} onClose={() => setAddNewEmp(false)} maxWidth="lg">
        <DialogContent>
          <AddEmployee onClose={() => setAddNewEmp(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddNewEmp(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} maxWidth="lg">
        <DialogContent>
          <UpdateEmployee data={updateData} onClose={() => setOpenUpdateDialog(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openErrDialog}
        onClose={() => {
          setOpenErrDialog(false);
          setErrMsg('');
        }}
      >
        <DialogTitle className="bg-danger text-center text-white">Error</DialogTitle>
        <DialogContent>
          <h3>{errmsg}</h3>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenErrDialog(false);
              setErrMsg('');
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDltDialog} onClose={() => setOpenDltDialog(false)}>
        <DialogContent>
          <p>Are you sure you want to delete this employee data?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmDlt} style={{ backgroundColor: 'red', color: 'white' }}>
            Delete
          </Button>
          <Button onClick={() => setOpenDltDialog(false)} style={{ backgroundColor: 'green', color: 'white' }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EmployeeIndex;
