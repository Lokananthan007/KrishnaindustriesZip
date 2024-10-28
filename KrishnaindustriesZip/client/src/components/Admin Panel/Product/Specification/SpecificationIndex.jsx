import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
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
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Search from '../../../Search Option/Search';
import AddProSpecification from './AddProSpecification';
import UpdateSpecification from './UpdateSpecification';
import config from '../../../../config';

const SpecificationIndex = () => {
  const { pro_id } = useParams();
  const [specData, setSpecData] = useState([]);
  const [searchSpecData, setSearchSpecData] = useState([]);
  const [updateData, setUpdateData] = useState();
  const [dltData, setDltData] = useState();
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [openNew, setOpenNew] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDlt, setOpenDlt] = useState(false);

  useEffect(() => {
    axios
      .get(`${config.apiUrl}/product/getProSpec/?pro_id=${pro_id}`)
      .then((res) => {
        setSpecData(res.data);
        setSearchSpecData(res.data);
      })
      .catch((err) => {
        console.log('Error :', err);
      });
  }, [openNew, openUpdate, openDlt]);

  const handleUpdate = (id) => {
    const selectUpdate = specData.find((spec) => spec.spec_id === id);
    if (selectUpdate) {
      setUpdateData(selectUpdate);
      setOpenUpdate(true);
    }
  };

  const handleDlt = (id) => {
    setDltData(id);
    setOpenDlt(true);
  };

  const confirmDlt = () => {
    if (dltData) {
      axios
        .delete(`${config.apiUrl}/product/specDelete/${dltData}`)
        .then(() => {
          setOpenDlt(false);
        })
        .catch((err) => {
          console.log('Specification Data is not deleted.');
        });
    }
  };

  const handleChangeDataPerPage = (e) => {
    const newDataPerPage = parseInt(e.target.value, 10);
    if (newDataPerPage === 1) {
      setDataPerPage(specData.length);
      setCurrentPage(1);
    } else {
      setDataPerPage(newDataPerPage);
      setCurrentPage(1);
    }
  };

  const firstIndexOfData = (currentPage - 1) * dataPerPage;
  const lastIndexOfData = currentPage * dataPerPage;
  const currentData = searchSpecData.slice(firstIndexOfData, lastIndexOfData);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(searchSpecData.length / dataPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <h1 className="text-center">Specification Index</h1>
      <Grid container spacing={3} className="mt-2">
        <Grid item xs={4}>
          <Button onClick={() => setOpenNew(true)}>Add New</Button>
        </Grid>
        <Grid item xs={4}>
          <Search data={specData} setData={setSearchSpecData} />
        </Grid>
        <Grid item xs={4}>
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
      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>S.No</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Project Name</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Specification Name</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Specification Data</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((spec, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1 + firstIndexOfData}</TableCell>
                <TableCell>{spec.pro_name}</TableCell>
                <TableCell>{spec.spec_name}</TableCell>
                <TableCell>{spec.spec_data}</TableCell>
                <TableCell>
                  <Button onClick={() => handleUpdate(spec.spec_id)}>Edit</Button>
                  <Button onClick={() => handleDlt(spec.spec_id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container spacing={2} className="mt-2">
        <Grid item xs={6}>
          <Button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </Button>
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(searchSpecData.length / dataPerPage)}>
            Next
          </Button>
        </Grid>
      </Grid>

      <Dialog open={openNew} onClose={() => setOpenNew(false)}>
        <DialogContent>
          <AddProSpecification pro_id={pro_id} onClose={() => setOpenNew(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNew(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)}>
        <DialogContent>
          <UpdateSpecification data={updateData} onClose={() => setOpenUpdate(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdate(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDlt} onClose={() => setOpenDlt(false)}>
        <DialogContent>
          <p>Are you sure do you want to delete this specification?</p>
        </DialogContent>
        <DialogActions>
          <Button style={{ backgroundColor: 'red', color: 'whitesmoke' }} onClick={confirmDlt}>
            Delete
          </Button>
          <Button style={{ backgroundColor: 'green', color: 'whitesmoke' }} onClick={() => setOpenDlt(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SpecificationIndex;
