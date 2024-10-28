import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Typography,
  Button
} from '@mui/material';
import { utils, writeFile } from 'xlsx';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import config from '../../../config';

// Utility function to format date
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const LeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [followingLeads, setFollowingLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchLeadsAndFollowing = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${config.apiUrl}/leads/api/leads-and-following`);
        const { leads, followingLeads } = response.data;

        // Ensure data is an array
        if (Array.isArray(leads) && Array.isArray(followingLeads)) {
          setLeads(leads);
          setFollowingLeads(followingLeads);
          setFilteredLeads(leads); // Set both leads and filteredLeads initially
        } else {
          console.error('Expected arrays of leads and following leads data');
        }
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadsAndFollowing();
  }, []);

  // Automatically apply filter when date or month changes
  useEffect(() => {
    let filtered = Array.isArray(leads) ? [...leads] : [];

    if (selectedDate) {
      filtered = filtered.filter((lead) => new Date(lead.QUERY_TIME).toDateString() === selectedDate.toDateString());
    } else if (selectedMonth && selectedYear) {
      filtered = filtered.filter((lead) => {
        const leadDate = new Date(lead.QUERY_TIME);
        return leadDate.getFullYear() === selectedYear && leadDate.getMonth() + 1 === parseInt(selectedMonth);
      });
    }

    setFilteredLeads(filtered);
    setPage(0); // Reset pagination to the first page when filtering
  }, [selectedDate, selectedMonth, selectedYear, leads]);

  // Handle month selection
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset pagination to first page when changing rows per page
  };

  // Calculate paginated data
  const paginatedLeads = filteredLeads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Match leads with followingLeads
  const getRowStyle = (leadId) => {
    return followingLeads.some((follow) => follow.leads_id === leadId) ? { backgroundColor: 'lightgreen' } : {};
  };

  // Export leads data to Excel
  const exportToExcel = async () => {
    setLoading(true);

    try {
      // Build query parameters based on filters
      const params = new URLSearchParams();
      if (selectedDate) {
        params.append('selectedDate', selectedDate.toISOString().split('T')[0]);
      } else if (selectedMonth) {
        params.append('selectedMonth', selectedMonth);
      }

      // Call the API with the appropriate filters
      const response = await axios.get(`${config.apiUrl}/leads/api/leads-data?${params.toString()}`);
      const leadsData = response.data;

      // Format the data for Excel export
      const formattedData = leadsData.map((lead) => ({
        'Query ID': lead.UNIQUE_QUERY_ID,
        'Query Type': lead.QUERY_TYPE,
        'Query Time': lead.QUERY_TIME,
        'Sender Name': lead.SENDER_NAME,
        'Sender Mobile': lead.SENDER_MOBILE,
        'Sender Email': lead.SENDER_EMAIL,
        Subject: lead.SUBJECT,
        Company: lead.SENDER_COMPANY,
        Address: lead.SENDER_ADDRESS,
        City: lead.SENDER_CITY,
        State: lead.SENDER_STATE,
        Pincode: lead.SENDER_PINCODE,
        'Country ISO': lead.SENDER_COUNTRY_ISO,
        'Alt Mobile': lead.SENDER_MOBILE_ALT,
        Phone: lead.SENDER_PHONE,
        'Alt Phone': lead.SENDER_PHONE_ALT,
        'Alt Email': lead.SENDER_EMAIL_ALT,
        'Product Name': lead.QUERY_PRODUCT_NAME,
        Message: lead.QUERY_MESSAGE,
        'MCAT Name': lead.QUERY_MCAT_NAME,
        'Call Duration': lead.CALL_DURATION,
        'Receiver Mobile': lead.RECEIVER_MOBILE
      }));

      // Generate Excel file
      const worksheet = utils.json_to_sheet(formattedData);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'Leads Data');

      // Trigger the file download
      writeFile(workbook, 'LeadsData.xlsx');
    } catch (error) {
      console.error('Error exporting leads data to Excel:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h1" align="center" gutterBottom>
        All IndiaMart Leads
      </Typography>
      <Grid container spacing={3} style={{ marginBottom: '20px' }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Total Leads
              </Typography>
              <Typography variant="h4" component="div">
                {leads.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Following Leads
              </Typography>
              <Typography variant="h4" component="div">
                {followingLeads.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <div style={{ marginBottom: '20px' }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newValue) => {
              setSelectedDate(newValue);
              setSelectedMonth(''); // Clear month selection when date is selected
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <FormControl style={{ marginRight: '10px', minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select value={selectedYear} onChange={handleYearChange} label="Year">
            {/* Generate options for years from 2020 to the current year */}
            {Array.from({ length: new Date().getFullYear() - 2019 }).map((_, index) => {
              const year = 2020 + index;
              return (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl style={{ marginRight: '10px', minWidth: 120 }}>
          <InputLabel>Month</InputLabel>
          <Select value={selectedMonth} onChange={handleMonthChange} label="Month">
            <MenuItem value="">None</MenuItem>
            {/* Generate options for each month */}
            {Array.from({ length: 12 }).map((_, monthIndex) => {
              const monthValue = (monthIndex + 1).toString().padStart(2, '0');
              return (
                <MenuItem key={monthValue} value={monthValue}>
                  {new Date(2020, monthIndex).toLocaleString('default', { month: 'long' })}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={exportToExcel}>
          Export to Excel
        </Button>
      </div>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Query ID</TableCell>
                <TableCell>Query Type</TableCell>
                <TableCell>Query Time</TableCell>
                <TableCell>Sender Name</TableCell>
                <TableCell>Sender Mobile</TableCell>
                <TableCell>Sender Email</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>City</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Pincode</TableCell>
                <TableCell>Product Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedLeads.map((lead) => (
                <TableRow key={lead.UNIQUE_QUERY_ID} style={getRowStyle(lead.leads_id)}>
                  <TableCell>{lead.UNIQUE_QUERY_ID}</TableCell>
                  <TableCell>{lead.QUERY_TYPE}</TableCell>
                  <TableCell>{formatDate(lead.QUERY_TIME)}</TableCell>
                  <TableCell>{lead.SENDER_NAME}</TableCell>
                  <TableCell>{lead.SENDER_MOBILE}</TableCell>
                  <TableCell>{lead.SENDER_EMAIL}</TableCell>
                  <TableCell>{lead.SUBJECT}</TableCell>
                  <TableCell>{lead.SENDER_COMPANY}</TableCell>
                  <TableCell>{lead.SENDER_CITY}</TableCell>
                  <TableCell>{lead.SENDER_STATE}</TableCell>
                  <TableCell>{lead.SENDER_PINCODE}</TableCell>
                  <TableCell>{lead.QUERY_PRODUCT_NAME}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredLeads.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
    </div>
  );
};

export default LeadsList;
