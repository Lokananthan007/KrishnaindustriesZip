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
  TableRow,
  TextField
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import config from '../../../config';
import { useNavigate } from 'react-router-dom';
import UpdateFlwLeads from '../Following Leads/UpdateFlwLeads';

const CustomerIndex = () => {
  const navigate = useNavigate();
  const [leadsData, setLeadsData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [filteredLeadsData, setFilteredLeadsData] = useState([]);
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [leadsState, setLeadsState] = useState('');
  const [leadsCity, setLeadsCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const emp_id = sessionStorage.getItem('emp_id');
  const [tabValue, setTablValue] = useState(1); // 1 for all leads, 2 for today's leads
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updateData, setUpdateData] = useState([]);

  useEffect(() => {
    // Fetch all leads once
    axios
      .get(`${config.apiUrl}/customer/CustomerLeadsByEmpId?emp_id=${emp_id}`)
      .then((res) => {
        const states = new Set(res.data.map((state) => state.leads_state));
        setStateData([...states]);
        setLeadsData(res.data);
        setFilteredLeadsData(res.data); // Default to show all leads
      })
      .catch((err) => {
        console.log('Leads data is not fetched.', err);
      });
  }, [openUpdate]);

  useEffect(() => {
    if (leadsState) {
      const filteredCities = new Set(leadsData.filter((lead) => lead.leads_state === leadsState).map((lead) => lead.leads_city));
      setCityData([...filteredCities]);
    } else {
      setCityData([]);
    }
  }, [leadsState]);

  useEffect(() => {
    const today = moment().format('YYYY-MM-DD');
    const filtered = leadsData.filter((lead) => {
      const matchesSearch =
        searchTerm === '' ||
        lead.leads_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.leads_name.toUpperCase().includes(searchTerm.toUpperCase) ||
        lead.leads_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.leads_email.toUpperCase().includes(searchTerm.toUpperCase()) ||
        lead.leads_mobile.includes(searchTerm);

      const matchesState = leadsState === '' || lead.leads_state === leadsState;
      const matchesCity = leadsCity === '' || lead.leads_city === leadsCity;

      // Filter based on tab selection (1: All Leads, 2: Today's Leads)
      const matchesTab = tabValue === 1 || (tabValue === 2 && moment(lead.created_at).format('YYYY-MM-DD') === today);

      return matchesSearch && matchesState && matchesCity && matchesTab;
    });
    setFilteredLeadsData(filtered);
  }, [searchTerm, leadsState, leadsCity, tabValue, leadsData]);

  const handleChangeDataPerPage = (e) => {
    const newDataPerPage = parseInt(e.target.value, 10);
    if (newDataPerPage == 1) {
      setDataPerPage(leadsData.length);
      setCurrentPage(1);
    } else {
      setDataPerPage(newDataPerPage);
      setCurrentPage(1);
    }
  };

  const firstIndexOfData = (currentPage - 1) * dataPerPage;
  const lastIndexOfData = currentPage * dataPerPage;
  const currentData = filteredLeadsData ? filteredLeadsData.slice(firstIndexOfData, lastIndexOfData) : [];

  const handleFilterClear = () => {
    setLeadsState('');
    setLeadsCity('');
    setSearchTerm('');
    setFilteredLeadsData(leadsData);
  };

  const handleUpdate = (id) => {
    const selectUpdate = leadsData.find((leads) => leads.follow_id === id);
    if (selectUpdate) {
      setUpdateData(selectUpdate);
      setOpenUpdate(true);
    }
  };
  const handleAddQuotationClick = (event, lead) => {
    setAnchorEl(event.currentTarget); // Track where the popover should open
    setSelectedLead(lead); // Track the currently selected lead
  };

  const handleClosePopover = () => {
    setAnchorEl(null); // Close popover
    setSelectedLead(null); // Clear selected lead
  };

  const handleOptionClick = (option, leadId) => {
    handleClosePopover();
    navigate(`/${option}/${leadId}`); // Navigate to the respective option (quotation, proforma, invoice) with the correct leadId
  };

  const open = Boolean(anchorEl);

  const handleFollowUps = (id) => {
    const selectConvert = leadsData.find((leads) => leads.follow_id === id);
    if (selectConvert) {
      setFollowupData(selectConvert);
      setOpenFollow(true);
    }
  };

  const handleConvert = (id) => {
    const selectConvert = leadsData.find((leads) => leads.follow_id === id);
    if (selectConvert) {
      setConvertData(selectConvert);
      setOpenConvert(true);
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <h1 className="text-center">Customer Index</h1>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Tabs value={tabValue} onChange={(event, newValue) => setTablValue(newValue)} centered>
              <Tab label="All Leads" value={1} />
              <Tab label="Today's Leads" value={2} />
            </Tabs>
          </Box>
        </Grid>
        <Grid item xs={4} display="flex" justifyContent="end">
          <Button variant="outlined" onClick={handleFilterClear}>
            Cancel Filters
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Search"
            placeholder="Search by name, email, or mobile"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <Select value={dataPerPage} onChange={handleChangeDataPerPage}>
              <MenuItem value={5}>5 Per Page</MenuItem>
              <MenuItem value={10}>10 Per Page</MenuItem>
              <MenuItem value={15}>15 Per Page</MenuItem>
              <MenuItem value={1}>All Per Page</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={6}>
          <TextField fullWidth select label="Select State" value={leadsState} onChange={(e) => setLeadsState(e.target.value)}>
            <MenuItem value="">All States</MenuItem>
            {stateData.map((state, index) => (
              <MenuItem key={index} value={state}>
                {state}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            select
            label="Select City"
            value={leadsCity}
            onChange={(e) => setLeadsCity(e.target.value)}
            disabled={!leadsState}
          >
            <MenuItem value="">All Cities</MenuItem>
            {cityData.map((city, index) => (
              <MenuItem key={index} value={city}>
                {city}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ fontWeight: 'bold', backgroundColor: '#FFF9C4' }}>
              <TableCell>S.No</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Leads Name</TableCell>
              <TableCell>Leads Mobile</TableCell>
              <TableCell>Leads Email</TableCell>
              <TableCell>Leads Company</TableCell>
              <TableCell>State</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Reminder Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((leads, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{leads.emp_name}</TableCell>
                <TableCell>{leads.leads_name}</TableCell>
                <TableCell>{leads.leads_mobile}</TableCell>
                <TableCell>{leads.leads_email}</TableCell>
                <TableCell>{leads.leads_company}</TableCell>
                <TableCell>{leads.leads_state}</TableCell>
                <TableCell>{leads.leads_city}</TableCell>
                <TableCell>{moment(leads.reminder_date).format('YYYY-MM-DD')}</TableCell>
                <TableCell>
                  {/* Quotation Button to Open Popover */}
                  <Button variant="outlined" onClick={(event) => handleAddQuotationClick(event, leads)}>
                    Quotation
                  </Button>

                  {/* Popover for options */}
                  <Popover
                    open={open && selectedLead?.follow_id === leads.follow_id} // Only open the popover for the selected lead
                    anchorEl={anchorEl}
                    onClose={handleClosePopover}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center'
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center'
                    }}
                  >
                    <MenuItem onClick={() => handleOptionClick('quotation', leads.follow_id)}>Quotation</MenuItem>
                    <MenuItem onClick={() => handleOptionClick('proforma', leads.follow_id)}>Proforma</MenuItem>
                    <MenuItem onClick={() => handleOptionClick('invoice', leads.follow_id)}>Invoice</MenuItem>
                  </Popover>

                  {/* Other Action Buttons */}
                  {/* <Button onClick={() => handleConvert(leads.follow_id)}>Convert</Button> */}
                  <Button onClick={() => handleUpdate(leads.follow_id)}>Edit</Button>
                  {/* <Button onClick={() => handleFollowUps(leads.follow_id)}>Follow Ups</Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={2} display="flex" justifyContent="center" className="mt-4">
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(filteredLeadsData.length / dataPerPage)}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            size="small"
          />
        </Stack>
      </Grid>

      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} maxWidth="md">
        <DialogContent>
          <UpdateFlwLeads data={updateData} onClose={() => setOpenUpdate(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdate(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* <Dialog open={openFollow} onClose={() => setOpenFollow(false)} maxWidth="md">
        <DialogTitle>Edit</DialogTitle>
        <DialogContent>
          <Followups data={followupData} onClose={() => setOpenFollow(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFollow(false)}>Close</Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
};

export default CustomerIndex;
