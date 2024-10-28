import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography
} from '@mui/material';
import config from '../../../config';

const CallNotAttendedLeads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');

  useEffect(() => {
    axios
      .get(`${config.apiUrl}/leads/callNotAttended`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setLeads(response.data);
          setFilteredLeads(response.data);
        } else {
          setError('Unexpected response format');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error fetching data');
        setLoading(false);
      });
  }, []);

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);
    setMonth(''); // Clear month filter if date is selected
    applyFilter(selectedDate, '');
  };

  const handleMonthChange = (event) => {
    const selectedMonth = event.target.value;
    setMonth(selectedMonth);
    setDate(''); // Clear date filter if month is selected
    applyFilter('', selectedMonth);
  };

  const applyFilter = (selectedDate, selectedMonth) => {
    let filtered = Array.isArray(leads) ? [...leads] : [];

    if (selectedDate) {
      filtered = filtered.filter((lead) => new Date(lead.date).toDateString() === new Date(selectedDate).toDateString());
    } else if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      filtered = filtered.filter((lead) => {
        const leadDate = new Date(lead.date);
        return leadDate.getFullYear() === parseInt(year) && leadDate.getMonth() + 1 === parseInt(month);
      });
    }

    setFilteredLeads(filtered);
  };

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error)
    return (
      <Typography variant="h6" color="error">
        Error fetching data: {error}
      </Typography>
    );

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Leads that don't accept calls
      </Typography>
      <Grid container spacing={2} style={{ marginBottom: '40px', marginTop: '30px' }}>
        <Grid item>
          <TextField label="Select Date" type="date" value={date} onChange={handleDateChange} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item>
          <TextField label="Select Month" type="month" value={month} onChange={handleMonthChange} InputLabelProps={{ shrink: true }} />
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>S.No</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Lead Name</TableCell>
              <TableCell>Lead Mobile</TableCell>
              <TableCell>Lead Email</TableCell>
              <TableCell>Lead Company</TableCell>
              <TableCell>Lead Address</TableCell>
              <TableCell>Lead State</TableCell>
              <TableCell>Lead City</TableCell>
              <TableCell>Product Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead, index) => (
                <TableRow key={lead.follow_id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{lead.leads_name}</TableCell>
                  <TableCell>{lead.leads_mobile}</TableCell>
                  <TableCell>{lead.leads_email}</TableCell>
                  <TableCell>{lead.leads_company}</TableCell>
                  <TableCell>{lead.leads_address}</TableCell>
                  <TableCell>{lead.leads_state}</TableCell>
                  <TableCell>{lead.leads_city}</TableCell>
                  <TableCell>{lead.product_name}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CallNotAttendedLeads;
