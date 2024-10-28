import { Grid, TextField, Button, Snackbar, Alert, ToggleButtonGroup, ToggleButton } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import config from '../../../config';

const AddFollowingLeads = ({ onClose, leadData, onSuccess }) => {
  const [formData, setFormData] = useState({
    emp_id: sessionStorage.getItem('emp_id') || '',
    leads_id: '',
    leads_name: '',
    leads_mobile: '',
    leads_email: '',
    leads_company: '',
    leads_address: '',
    leads_state: '',
    leads_city: '',
    product_name: '',
    Call_Discussion: '',
    call_Attended: 'Not Attended', // Default value
    remember: 'No', // Default value
    reminder_date: '' || ``,
    Description: ''
  });

  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (leadData) {
      setFormData((prev) => ({
        ...prev,
        leads_id: leadData.UNIQUE_QUERY_ID || '',
        leads_name: leadData.SENDER_NAME || '',
        leads_mobile: leadData.SENDER_MOBILE || '',
        leads_email: leadData.SENDER_EMAIL || '',
        leads_company: leadData.SENDER_COMPANY || '',
        leads_address: leadData.SENDER_ADDRESS || '',
        leads_state: leadData.SENDER_STATE || '',
        leads_city: leadData.SENDER_CITY || '',
        product_name: leadData.QUERY_PRODUCT_NAME || ''
      }));
    }
  }, [leadData]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    const error = handleValidation(name, value);
    setFormData({ ...formData, [name]: value || '' });
    setErrors({ ...errors, [name]: error });
  };

  const handleValidation = (name, value) => {
    let error = '';

    if (name === 'leads_name' && value && !/^[a-zA-Z\s]*$/.test(value)) {
      error = 'Enter only letters';
    }
    if (name === 'leads_mobile' && value && !/^[-+,\d]*$/.test(value)) {
      error = 'Enter a valid phone number (can include +, -, ,)';
    }
    if (name === 'leads_email' && value && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Enter a valid email address';
    }
    if (name === 'Call_Discussion' && formData.call_Attended === 'Attended' && !value) {
      error = 'Call Discussion is required if Call Attended is Attended';
    }
    if (name === 'reminder_date' && formData.remember === 'Yes' && !value) {
      error = 'Reminder Date is required if Remember is Yes';
    }

    return error;
  };

  const handleSubmit = async () => {
    // Perform validation before submitting
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = handleValidation(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(`${config.apiUrl}/leads/following-leads`, formData);
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onSuccess();
    } catch (error) {
      setSnackbarMessage('Failed to submit lead data');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <h1 className="text-center">Follow Leads</h1>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="leads_name"
            label="Lead Name"
            value={formData.leads_name || ''}
            onChange={handleChangeInput}
            error={!!errors.leads_name}
            helperText={errors.leads_name}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="leads_mobile"
            label="Lead Mobile"
            value={formData.leads_mobile || ''}
            onChange={handleChangeInput}
            error={!!errors.leads_mobile}
            helperText={errors.leads_mobile}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="leads_email"
            label="Lead Email"
            value={formData.leads_email || ''}
            onChange={handleChangeInput}
            error={!!errors.leads_email}
            helperText={errors.leads_email}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="leads_company"
            label="Lead Company"
            value={formData.leads_company || ''}
            onChange={handleChangeInput}
            error={!!errors.leads_company}
            helperText={errors.leads_company}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="leads_address"
            label="Lead Address"
            value={formData.leads_address || ''}
            onChange={handleChangeInput}
            error={!!errors.leads_address}
            helperText={errors.leads_address}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="leads_state"
            label="Lead State"
            value={formData.leads_state || ''}
            onChange={handleChangeInput}
            error={!!errors.leads_state}
            helperText={errors.leads_state}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="leads_city"
            label="Lead City"
            value={formData.leads_city || ''}
            onChange={handleChangeInput}
            error={!!errors.leads_city}
            helperText={errors.leads_city}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="product_name"
            label="Product Name"
            value={formData.product_name || ''}
            onChange={handleChangeInput}
            error={!!errors.product_name}
            helperText={errors.product_name}
          />
        </Grid>
        <Grid item xs={6}>
          <ToggleButtonGroup
            value={formData.call_Attended}
            exclusive
            onChange={(e, newValue) => {
              if (newValue !== null) {
                handleChangeInput({
                  target: { name: 'call_Attended', value: newValue }
                });
              }
            }}
            aria-label="Call Attended"
          >
            <ToggleButton value="Attended" aria-label="Call Attended">
              Call Attended
            </ToggleButton>
            <ToggleButton value="Not Attended" aria-label="Call Not Attended">
              Call Not Attended
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        {formData.call_Attended === 'Attended' && (
          <>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="Call_Discussion"
                label="Call Discussion"
                value={formData.Call_Discussion || ''}
                onChange={handleChangeInput}
                error={!!errors.Call_Discussion}
                helperText={errors.Call_Discussion}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={6}>
              <ToggleButtonGroup
                label="Remember"
                value={formData.remember}
                exclusive
                onChange={(e, newValue) => {
                  if (newValue !== null) {
                    handleChangeInput({
                      target: { name: 'remember', value: newValue }
                    });
                  }
                }}
                aria-label="Remember"
              >
                <ToggleButton value="Yes" aria-label="Remember Yes">
                  Remember
                </ToggleButton>
                <ToggleButton value="No" aria-label="Remember No">
                  Not Remember
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            {formData.remember === 'Yes' && (
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="reminder_date"
                  label="Reminder Date"
                  type="date"
                  value={formData.reminder_date || ''}
                  onChange={handleChangeInput}
                  error={!!errors.reminder_date}
                  helperText={errors.reminder_date}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
            )}
          </>
        )}
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="Description"
            label="Description"
            value={formData.Description || ''}
            onChange={handleChangeInput}
            error={!!errors.Description}
            helperText={errors.Description}
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddFollowingLeads;
