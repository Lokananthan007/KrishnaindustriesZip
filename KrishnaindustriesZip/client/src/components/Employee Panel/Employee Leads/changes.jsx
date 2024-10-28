import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Search from '../../Search Option/Search';
import LeadsFilterForm from './LeadsFilterForm';
import AddFollowingLeads from '../Following Leads/AddFollowingLeads';
import ConvertCustomer from '../Customer/ConvertCustomer';
import config from '../../../config';
import { makeStyles } from '@mui/styles';

// Styles for the component
const useStyles = makeStyles((theme) => ({
  tableContainer: {
    maxHeight: '600px' // Scrollable table height
  },
  stickyAction: {
    position: 'sticky',
    right: 0,
    backgroundColor: '#fff', // Add background to avoid overlap with other content
    zIndex: 1 // Ensure it appears above other table cells
  },
  actionColumnHeader: {
    position: 'sticky',
    right: 0,
    backgroundColor: '#fff',
    zIndex: 2 // Make sure the header has a higher z-index than the body
  }
}));

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = hours.toString().padStart(2, '0');

  return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
};

const EmpLeadsIndex = () => {
  const classes = useStyles();
  const [leadsData, setLeadsData] = useState([]);
  const [followingLeadsData, setFollowingLeadsData] = useState([]);
  const [unfollowedLeads, setUnfollowedLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedFilter, setSearchedFilter] = useState([]);
  const [openFollowForm, setOpenFollowForm] = useState(false);
  const [followData, setFollowData] = useState();
  const [openConvert, setOpenConvert] = useState(false);
  const [convertData, setConvertData] = useState([]);
  const [showTodayLeads, setShowTodayLeads] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchLeadsData(); // Fetch leads data on mount
    fetchFollowingLeadsData(); // Fetch following leads data on mount
  }, []);

  const fetchLeadsData = () => {
    axios
      .get(`${config.apiUrl}/leads/getleads`)
      .then((res) => {
        if (res.data.data.length > 0) {
          setLeadsData(res.data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setSnackbarMessage('An error occurred while fetching leads data.');
        setSnackbarOpen(true);
        setLoading(false);
      });
  };

  const fetchFollowingLeadsData = () => {
    axios
      .get(`${config.apiUrl}/leads/getFollowingLeadsMobile`)
      .then((res) => {
        setFollowingLeadsData(res.data); // The data from the following_leads table
        console.log(res.data);
      })
      .catch((err) => {
        console.log("Error: Couldn't fetch following leads data.");
      });
  };

  useEffect(() => {
    if (leadsData.length > 0 && followingLeadsData.length > 0) {
      const followedLeadsIds = followingLeadsData.map((lead) => lead.leads_id); // map leads_id from following_leads
      const filteredLeads = leadsData.filter((lead) => !followedLeadsIds.includes(lead.UNIQUE_QUERY_ID));
      setUnfollowedLeads(filteredLeads);
      setSearchedFilter(filteredLeads); // Set default filter to unfollowed leads
    }
  }, [leadsData, followingLeadsData]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleShowTodayLeads = () => {
    if (showTodayLeads) {
      setSearchedFilter(unfollowedLeads); // Reset to all unfollowed leads
    } else {
      const today = moment().format('YYYY-MM-DD');
      const todayLeads = unfollowedLeads.filter((lead) => moment(lead.QUERY_TIME).format('YYYY-MM-DD') === today);
      setSearchedFilter(todayLeads);
    }
    setShowTodayLeads(!showTodayLeads);
    setCurrentPage(1); // Reset to the first page when toggling
  };

  const firstIndexOfData = (currentPage - 1) * dataPerPage;
  const lastIndexOfData = currentPage * dataPerPage;
  const currentData = searchedFilter.slice(firstIndexOfData, lastIndexOfData);

  const handleFollow = (id) => {
    if (leadsData.length > 0) {
      const selectData = leadsData.find((leads) => leads.UNIQUE_QUERY_ID === id);
      if (selectData) {
        setFollowData(selectData);
        setOpenFollowForm(true);
      }
    }
  };

  const handleConvert = (id) => {
    if (leadsData.length > 0) {
      const selectData = leadsData.find((leads) => leads.UNIQUE_QUERY_ID === id);
      if (selectData) {
        setConvertData(selectData);
        setOpenConvert(true);
      }
    }
  };

  return (
    <div>
      <h1 className="text-center">Leads Index</h1>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <CircularProgress />
          <p>Processing... Please wait.</p>
        </div>
      ) : (
        <>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <Search data={unfollowedLeads} setData={setSearchedFilter} />
            </Grid>
            <Grid item xs={3}>
              <Button variant="contained" onClick={handleShowTodayLeads}>
                {showTodayLeads ? 'Show All Unfollowed Leads' : 'Show Today Unfollowed Leads'}
              </Button>
            </Grid>
            <Grid item xs={3}>
              <FormControl>
                <Select value={dataPerPage} onChange={(e) => setDataPerPage(e.target.value)}>
                  {[5, 10, 15, 20].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size} per page
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <TableContainer component={Paper} className={classes.tableContainer} style={{ marginTop: '20px' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }}>S.No</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Unique Query ID</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Query Type</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Query Time</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Mobile No</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Company Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Address</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>City</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>State</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Pincode</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Country</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Alternate Mobile</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Phone</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Alt Phone</TableCell>
                  <TableCell className={classes.actionColumnHeader}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.length > 0 ? (
                  currentData.map((lead, index) => (
                    <TableRow key={lead.UNIQUE_QUERY_ID}>
                      <TableCell>{firstIndexOfData + index + 1}</TableCell>
                      <TableCell>{lead.UNIQUE_QUERY_ID}</TableCell>
                      <TableCell>{lead.QUERY_TYPE}</TableCell>
                      <TableCell>{formatDate(lead.QUERY_TIME)}</TableCell>
                      <TableCell>{lead.NAME}</TableCell>
                      <TableCell>{lead.MOBILE}</TableCell>
                      <TableCell>{lead.EMAIL}</TableCell>
                      <TableCell>{lead.COMPANY_NAME}</TableCell>
                      <TableCell>{lead.ADDRESS}</TableCell>
                      <TableCell>{lead.CITY}</TableCell>
                      <TableCell>{lead.STATE}</TableCell>
                      <TableCell>{lead.PINCODE}</TableCell>
                      <TableCell>{lead.COUNTRY_ISO}</TableCell>
                      <TableCell>{lead.MOBILE_ALT}</TableCell>
                      <TableCell>{lead.PHONE}</TableCell>
                      <TableCell>{lead.PHONE_ALT}</TableCell>
                      <TableCell className={classes.stickyAction}>
                        <Button variant="contained" color="primary" onClick={() => handleFollow(lead.UNIQUE_QUERY_ID)}>
                          Follow
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          style={{ marginLeft: '5px' }}
                          onClick={() => handleConvert(lead.UNIQUE_QUERY_ID)}
                        >
                          Convert
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={17} style={{ textAlign: 'center' }}>
                      No leads found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Stack spacing={2} style={{ marginTop: '20px' }} alignItems="center">
            <Pagination
              count={Math.ceil(searchedFilter.length / dataPerPage)}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
            />
          </Stack>
        </>
      )}

      {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} message={snackbarMessage} />

      {/* Dialog for follow form */}
      <Dialog open={openFollowForm} onClose={() => setOpenFollowForm(false)}>
        <DialogTitle>Follow Lead</DialogTitle>
        <DialogContent>
          <AddFollowingLeads followData={followData} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFollowForm(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for convert form */}
      <Dialog open={openConvert} onClose={() => setOpenConvert(false)}>
        <DialogTitle>Convert Lead to Customer</DialogTitle>
        <DialogContent>
          <ConvertCustomer convertData={convertData} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConvert(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EmpLeadsIndex;
