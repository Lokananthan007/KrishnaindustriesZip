import { Grid, TextField, MenuItem, Button, Checkbox, Snackbar, Alert, FormControlLabel } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import config from '../../../config';

const AddWakeingLeads = ({ onClose, onSuccess }) => {
  const emp_id = sessionStorage.getItem('emp_id');
  const [newLeadData, setNewLeadData] = useState({
    emp_id: emp_id,
    leads_name: '',
    leads_mobile: '',
    leads_email: '',
    leads_company: '',
    leads_address: '',
    leads_city: '',
    leads_state: '',
    call_Attended: 'Attended',
    Call_Discussion: '',
    remember: 'No',
    reminder_date: '',
    gst_number: '',
    billing_address: {
      door_number: '',
      street: '',
      landMark: '',
      city: '',
      state: '',
      pincode: ''
    },
    shipping_address: {
      door_number: '',
      street: '',
      landMark: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  const [errors, setErrors] = useState({
    Call_Discussion: '',
    remember: '',
    reminder_date: ''
  });

  const [isAddressSame, setIsAddressSame] = useState(false);
  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleValidation = (name, value) => {
    let errMsg = '';
    const trimmedValue = value && typeof value === 'string' ? value.trim() : value;
    switch (name) {
      case 'Call_Discussion':
        if (!trimmedValue) {
          errMsg = 'Leads Query Message is Required';
        }
        break;
      case 'remember':
        if (!trimmedValue) {
          errMsg = 'Please Select one';
        } else if (trimmedValue === 'Yes' && !newLeadData.reminder_date) {
          errMsg = 'Reminder Date is Required';
        }
        break;
      default:
        break;
    }
    return errMsg;
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    // Format the value to have the first letter capitalized and the rest lowercase
    const formattedValue = value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

    // Handle billing_address and shipping_address fields separately
    if (name.startsWith('billing_address') || name.startsWith('shipping_address')) {
      const [addressType, field] = name.split('.');

      setNewLeadData((prevData) => ({
        ...prevData,
        [addressType]: {
          ...prevData[addressType],
          [field]: formattedValue || ''
        },

        ...(addressType === 'billing_address' && {
          leads_city: field === 'city' ? formattedValue : prevData.leads_city,
          leads_state: field === 'state' ? formattedValue : prevData.leads_state
        })
      }));

      // Sync shipping address if "Same as Billing" is checked
      if (isAddressSame && addressType === 'billing_address') {
        setNewLeadData((prevData) => ({
          ...prevData,
          shipping_address: {
            ...prevData.shipping_address,
            [field]: formattedValue || ''
          }
        }));
      }
    } else {
      setNewLeadData((prevData) => ({
        ...prevData,
        [name]: formattedValue || ''
      }));
    }

    // Validate the input
    const error = handleValidation(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleAddressSameToggle = () => {
    setIsAddressSame(!isAddressSame);
    if (!isAddressSame) {
      // Sync shipping address with billing address
      setNewLeadData((prevData) => ({
        ...prevData,
        shipping_address: { ...prevData.billing_address }
      }));
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = {};

    Object.keys(newLeadData).forEach((name) => {
      const value = newLeadData[name];
      const error = handleValidation(name, value);
      if (error) {
        formErrors[name] = error;
      }
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      axios
        .post(`${config.apiUrl}/leads/waking-leads/create`, newLeadData) // API call to create a new lead
        .then((res) => {
          console.log('New Lead Created Successfully.', res);
          setSnackbarMessage('New Lead created successfully.');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);

          onSuccess();
        })
        .catch((err) => {
          console.log('Lead creation failed', err);
          setSnackbarMessage('New Lead created failed.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        });
    }
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField fullWidth name="leads_name" label="Lead Name" value={newLeadData.leads_name || ''} onChange={handleChangeInput} />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="leads_mobile"
            label="Lead Mobile"
            value={newLeadData.leads_mobile || ''}
            onChange={handleChangeInput}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth name="leads_email" label="Lead Email" value={newLeadData.leads_email || ''} onChange={handleChangeInput} />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="leads_company"
            label="Lead Company"
            value={newLeadData.leads_company || ''}
            onChange={handleChangeInput}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField fullWidth name="gst_number" label="GST Number" value={newLeadData.gst_number || ''} onChange={handleChangeInput} />
        </Grid>

        <Grid item xs={12}>
          <h3>Billing Address</h3>
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="billing_address.door_number"
            label="Door Number"
            value={newLeadData.billing_address.door_number || ''}
            onChange={handleChangeInput}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="billing_address.street"
            label="Street"
            value={newLeadData.billing_address.street || ''}
            onChange={handleChangeInput}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="billing_address.landMark"
            label="Land Mark"
            value={newLeadData.billing_address.landMark || ''}
            onChange={handleChangeInput}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="billing_address.city"
            label="City"
            value={newLeadData.billing_address.city || ''}
            onChange={handleChangeInput}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="billing_address.state"
            label="State"
            value={newLeadData.billing_address.state || ''}
            onChange={handleChangeInput}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="billing_address.pincode"
            label="Pincode"
            value={newLeadData.billing_address.pincode || ''}
            onChange={handleChangeInput}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={isAddressSame} onChange={handleAddressSameToggle} />}
            label="Same as Billing Address"
          />
        </Grid>
        <Grid item xs={12}>
          <h3>Shipping Address</h3>
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="shipping_address.door_number"
            label="Door Number"
            value={newLeadData.shipping_address.door_number || ''}
            onChange={handleChangeInput}
            disabled={isAddressSame}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="shipping_address.street"
            label="Street"
            value={newLeadData.shipping_address.street || ''}
            onChange={handleChangeInput}
            disabled={isAddressSame}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="shipping_address.landMark"
            label="Land Mark"
            value={newLeadData.shipping_address.landMark || ''}
            onChange={handleChangeInput}
            disabled={isAddressSame}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="shipping_address.city"
            label="City"
            value={newLeadData.shipping_address.city || ''}
            onChange={handleChangeInput}
            disabled={isAddressSame}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="shipping_address.state"
            label="State"
            value={newLeadData.shipping_address.state || ''}
            onChange={handleChangeInput}
            disabled={isAddressSame}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="shipping_address.pincode"
            label="Pincode"
            value={newLeadData.shipping_address.pincode || ''}
            onChange={handleChangeInput}
            disabled={isAddressSame}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={newLeadData.remember === 'Yes'}
                onChange={() =>
                  setNewLeadData((prevData) => ({
                    ...prevData,
                    remember: newLeadData.remember === 'Yes' ? 'No' : 'Yes'
                  }))
                }
              />
            }
            label="Remember"
          />
        </Grid>

        {newLeadData.remember === 'Yes' && (
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="reminder_date"
              label="Reminder Date"
              type="date"
              value={newLeadData.reminder_date}
              onChange={handleChangeInput}
              error={!!errors.reminder_date}
              helperText={errors.reminder_date}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            name="Call_Discussion"
            label="Call Discussion"
            multiline
            rows={4}
            value={newLeadData.Call_Discussion || ''}
            onChange={handleChangeInput}
            error={!!errors.Call_Discussion}
            helperText={errors.Call_Discussion}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Grid>
      </Grid>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000} // Automatically close after 4 seconds
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Optional: Adjust the position
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddWakeingLeads;
