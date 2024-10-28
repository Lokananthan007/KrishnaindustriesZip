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
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Alert
} from '@mui/material';
import config from '../../../config';

const EmpCallNotAttendedLeads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');

  // State for Dialog
  const [open, setOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [formData, setFormData] = useState({
    callStatus: '', // 'Call Accepted' or 'Call Received'
    callDiscussion: '',
    reminder: false,
    reminderDate: ''
  });

  // State for Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' // 'success' | 'error' | 'warning' | 'info'
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = () => {
    const empId = sessionStorage.getItem('emp_id');
    setLoading(true);
    axios
      .get(`${config.apiUrl}/employee/getNotcallattedeByEmpId/${empId}`)
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
        setError(err.response?.data?.message || err.message || 'Error fetching data');
        setLoading(false);
      });
  };

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
      const targetDate = new Date(selectedDate).toDateString();
      filtered = filtered.filter((lead) => new Date(lead.created_at).toDateString() === targetDate);
    } else if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      filtered = filtered.filter((lead) => {
        const leadDate = new Date(lead.created_at);
        return leadDate.getFullYear() === parseInt(year) && leadDate.getMonth() + 1 === parseInt(month);
      });
    }

    setFilteredLeads(filtered);
  };

  const handleStatusChange = (leadId) => {
    setSelectedLeadId(leadId);
    setOpen(true); // Open the dialog
  };

  const handleDialogClose = () => {
    setOpen(false); // Close the dialog
    setSelectedLeadId(null);
    setFormData({
      callStatus: '',
      callDiscussion: '',
      reminder: false,
      reminderDate: ''
    });
  };

  const handleChangeInput = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToggleChange = (event, newValue) => {
    if (newValue !== null) {
      setFormData((prevData) => ({
        ...prevData,
        callStatus: newValue
      }));
    }
  };

  const handleFormSubmit = () => {
    // Validate required fields
    if (!formData.callStatus) {
      setSnackbar({
        open: true,
        message: 'Please select a call status (Call Accepted or Call Received).',
        severity: 'warning'
      });
      return;
    }

    // Prepare data to send
    const submissionData = {
      follow_id: selectedLeadId,
      callStatus: formData.callStatus,
      callDiscussion: formData.callDiscussion,
      remainder: formData.reminder ? 'Yes' : 'No',
      reminderDate: formData.reminder ? formData.reminderDate : null
    };

    // API call to update lead details
    axios
      .post(`${config.apiUrl}/employee/UpdateNotattendedleads`, submissionData)
      .then((response) => {
        setSnackbar({
          open: true,
          message: 'Lead status updated successfully!',
          severity: 'success'
        });
        fetchLeads();
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          message: err.response?.data?.message || 'Error submitting form data.',
          severity: 'error'
        });
      });

    handleDialogClose(); // Close the dialog after submitting
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading)
    return (
      <Typography variant="h6" align="center" style={{ marginTop: '20px' }}>
        Loading...
      </Typography>
    );
  if (error)
    return (
      <Typography variant="h6" color="error" align="center" style={{ marginTop: '20px' }}>
        Error fetching data: {error}
      </Typography>
    );

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom align="center">
        Leads that Don't Accept Calls
      </Typography>
      <Grid container spacing={2} style={{ marginBottom: '40px', marginTop: '30px' }} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Select Date"
            type="date"
            value={date}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Select Month"
            type="month"
            value={month}
            onChange={handleMonthChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
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
              <TableCell>Action</TableCell>
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
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleStatusChange(lead.follow_id)}>
                      Follow Up
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Follow Up */}
      <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Follow Up</DialogTitle>
        <DialogContent>
          <ToggleButtonGroup
            value={formData.callStatus}
            exclusive
            onChange={handleToggleChange}
            aria-label="call status"
            style={{ marginBottom: '20px' }}
          >
            <ToggleButton value="Attended " aria-label="call accepted">
              Call Accepted
            </ToggleButton>
            <ToggleButton value="Attended" aria-label="call received">
              Call Received
            </ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label="Discussion"
            name="callDiscussion"
            value={formData.callDiscussion}
            onChange={handleChangeInput}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            style={{ marginBottom: '20px' }}
          />

          <FormControlLabel
            control={<Checkbox name="reminder" checked={formData.reminder} onChange={handleChangeInput} />}
            label="Set Reminder"
          />

          {formData.reminder && (
            <TextField
              label="Reminder Date"
              type="date"
              name="reminderDate"
              value={formData.reminderDate}
              onChange={handleChangeInput}
              InputLabelProps={{ shrink: true }}
              fullWidth
              style={{ marginTop: '10px' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EmpCallNotAttendedLeads;
