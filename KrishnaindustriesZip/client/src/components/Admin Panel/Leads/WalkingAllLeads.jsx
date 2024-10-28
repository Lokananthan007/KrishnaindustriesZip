import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config';

// MUI components
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  TextField,
  Button
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  header: {
    fontWeight: 'bold'
  },
  container: {
    marginTop: 20
  },
  filters: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px'
  },
  datePicker: {
    '& .MuiInputBase-root': {
      borderRadius: '8px',
      backgroundColor: '#f4f6f8'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ccc'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1976d2' // Primary color
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1976d2' // Primary color when focused
    }
  },
  searchInput: {
    '& .MuiInputBase-root': {
      borderRadius: '8px'
    }
  },
  button: {
    backgroundColor: '#1976d2',

    color: '#fff',
    '&:hover': {
      backgroundColor: '#115293'
    },
    padding: '2px 1px',
    height: 50,
    top: 17
  },
  monthYearPicker: {
    minWidth: '200px' // Set the desired width
    // You can also adjust maxWidth or any other styles as needed
  }
});

const WalkingLeadsList = () => {
  const classes = useStyles();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    // Fetch leads from the backend
    axios
      .get(`${config.apiUrl}/leads/walking-leads`)
      .then((response) => {
        setLeads(response.data);
        setFilteredLeads(response.data); // Initially set to full data
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching leads:', error);
        setLoading(false);
      });
  }, []);

  // Handle search filtering
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = leads.filter(
      (lead) =>
        lead.leads_name.toLowerCase().includes(query) ||
        lead.leads_company.toLowerCase().includes(query) ||
        lead.leads_mobile.includes(query)
    );
    setFilteredLeads(filtered);
  };

  // Handle date range filtering
  const filterByDateRange = () => {
    if (startDate && endDate) {
      const filtered = leads.filter((lead) => {
        const leadDate = new Date(lead.created_at);
        return leadDate >= startDate && leadDate <= endDate;
      });
      setFilteredLeads(filtered);
    }
  };

  // Handle month filtering
  const filterByMonth = () => {
    if (selectedMonth) {
      const formattedMonth = format(selectedMonth, 'yyyy-MM'); // Format to "YYYY-MM"
      const filtered = leads.filter((lead) => {
        return lead.created_at.startsWith(formattedMonth);
      });
      setFilteredLeads(filtered);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className={classes.container}>
      <Typography variant="h1" align="center" gutterBottom>
        Walking Leads
      </Typography>

      {/* Search and Filters */}
      <div className={classes.filters}>
        <TextField
          className={classes.searchInput}
          label="Search by Name, Company, or Mobile"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          fullWidth={false}
        />
      </div>
      <div className={classes.filters}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newDate) => setStartDate(newDate)}
            renderInput={(params) => <TextField {...params} className={classes.datePicker} />}
          />

          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newDate) => setEndDate(newDate)}
            renderInput={(params) => <TextField {...params} className={classes.datePicker} />}
          />

          <Button variant="contained" className={classes.button} onClick={filterByDateRange}>
            Filter by Date
          </Button>

          <DatePicker
            views={['year', 'month']}
            label="Month and Year"
            value={selectedMonth}
            onChange={(newMonth) => setSelectedMonth(newMonth)}
            renderInput={(params) => <TextField {...params} className={`${classes.datePicker} ${classes.monthYearPicker}`} />}
          />
          <Button variant="contained" className={classes.button} onClick={filterByMonth}>
            Filter by Month
          </Button>
        </LocalizationProvider>
      </div>

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="leads table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.header}>Lead ID</TableCell>
              <TableCell className={classes.header}>Employee ID</TableCell>
              <TableCell className={classes.header}>Name</TableCell>
              <TableCell className={classes.header}>Mobile</TableCell>
              <TableCell className={classes.header}>Email</TableCell>
              <TableCell className={classes.header}>Company</TableCell>
              <TableCell className={classes.header}>Address</TableCell>
              <TableCell className={classes.header}>City</TableCell>
              <TableCell className={classes.header}>State</TableCell>
              <TableCell className={classes.header}>Call Attended</TableCell>
              <TableCell className={classes.header}>GST Number</TableCell>
              <TableCell className={classes.header}>Billing Address</TableCell>
              <TableCell className={classes.header}>Shipping Address</TableCell>
              <TableCell className={classes.header}>Created At</TableCell>
              <TableCell className={classes.header}>Updated At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.leads_id}>
                <TableCell>{lead.leads_id}</TableCell>
                <TableCell>{lead.emp_id}</TableCell>
                <TableCell>{lead.leads_name}</TableCell>
                <TableCell>{lead.leads_mobile}</TableCell>
                <TableCell>{lead.leads_email}</TableCell>
                <TableCell>{lead.leads_company}</TableCell>
                <TableCell>{lead.leads_address}</TableCell>
                <TableCell>{lead.leads_city}</TableCell>
                <TableCell>{lead.leads_state}</TableCell>
                <TableCell>{lead.call_Attended}</TableCell>
                <TableCell>{lead.gst_number}</TableCell>
                <TableCell>{`${lead.billing_door_number}, ${lead.billing_street}, ${lead.billing_landMark}, ${lead.billing_city}, ${lead.billing_state}, ${lead.billing_pincode}`}</TableCell>
                <TableCell>{`${lead.shipping_door_number}, ${lead.shipping_street}, ${lead.shipping_landMark}, ${lead.shipping_city}, ${lead.shipping_state}, ${lead.shipping_pincode}`}</TableCell>
                <TableCell>{new Date(lead.created_at).toLocaleString()}</TableCell>
                <TableCell>{new Date(lead.updated_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default WalkingLeadsList;
