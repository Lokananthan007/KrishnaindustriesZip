import { Button, Grid, MenuItem, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const LeadsFilterForm = ({ onFilterChange }) => {
  const [statesData, setStatesData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch unique states from session storage on component mount
  useEffect(() => {
    const storedData = sessionStorage.getItem('leadsData');
    if (storedData) {
      const leads = JSON.parse(storedData);
      const uniqueStates = [...new Set(leads.map(lead => lead.SENDER_STATE))];
      setStatesData(uniqueStates);
    }
  }, []);

  // Fetch unique cities based on selected state
  useEffect(() => {
    if (selectedState) {
      const storedData = sessionStorage.getItem('leadsData');
      if (storedData) {
        const leads = JSON.parse(storedData);
        const filteredCities = leads
          .filter(lead => lead.SENDER_STATE === selectedState)
          .map(lead => lead.SENDER_CITY);
        setCitiesData([...new Set(filteredCities)]);
      }
    } else {
      setCitiesData([]);
    }
  }, [selectedState]);

  // Handle filter button click
  const handleFilterClick = () => {
    if (onFilterChange) {
      onFilterChange(selectedState, selectedCity, startDate, endDate);
    }
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            select
            fullWidth
            label="Select State"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            {statesData.map((state, index) => (
              <MenuItem key={index} value={state}>{state}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            select
            fullWidth
            label="Select City"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedState}
          >
            {citiesData.map((city, index) => (
              <MenuItem key={index} value={city}>{city}</MenuItem>
            ))}
          </TextField>
        </Grid>
        {/* <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Start Date"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              renderInput={(props) => <TextField {...props} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="End Date"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              renderInput={(props) => <TextField {...props} fullWidth />}
            />
          </LocalizationProvider>
        </Grid> */}
        <Grid item xs={12} display="flex" justifyContent="center">
          <Button variant="contained" onClick={handleFilterClick}>Filter</Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default LeadsFilterForm;
