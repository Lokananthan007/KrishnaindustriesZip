import { Grid, TextField, MenuItem, Button, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import config from '../../../config';

const UpdateFlwLeads = ({ onClose, data, onSuccess }) => {
  const [updateData, setUpdateData] = useState({
    leads_name: data ? data.leads_name : '',
    leads_mobile: data ? data.leads_mobile : '',
    leads_email: data ? data.leads_email : '',
    leads_company: data ? data.leads_company : '',
    leads_address: data ? data.leads_address : '',
    leads_state: data ? data.leads_state : '',
    leads_city: data ? data.leads_city : '',
    product_name: data ? data.product_name : '',
    Call_Discussion: data ? data.Call_Discussion : '',
    remember: data ? data.remember : '',
    reminder_date: data ? data.reminder_date : '',
    gst_number: data ? data.gst_number : '',
    billing_address: {
      door_number: data ? data.billing_door_number : '',
      street: data ? data.billing_street : '',
      landMark: data ? data.billing_landMark : '',
      city: data ? data.billing_city : '',
      state: data ? data.billing_state : '',
      pincode: data ? data.billing_pincode : ''
    },
    shipping_address: {
      door_number: data ? data.shipping_door_number : '',
      street: data ? data.shipping_street : '',
      landMark: data ? data.shipping_landMark : '',
      city: data ? data.shipping_city : '',
      state: data ? data.shipping_state : '',
      pincode: data ? data.shipping_pincode : ''
    }
  });

  const [errors, setErrors] = useState({
    Call_Discussion: '',
    remember: '',
    reminder_date: ''
  });

  const [isAddressSame, setIsAddressSame] = useState(false);

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
        } else if (trimmedValue === 'yes' && !updateData.reminder_date) {
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

      // Update the relevant address
      setUpdateData((prevData) => ({
        ...prevData,
        [addressType]: {
          ...prevData[addressType],
          [field]: formattedValue || '' // Fallback to empty string if value is null
        }
      }));

      // Sync shipping address if "Same as Billing" is checked
      if (isAddressSame && addressType === 'billing_address') {
        setUpdateData((prevData) => ({
          ...prevData,
          shipping_address: {
            ...prevData.shipping_address,
            [field]: formattedValue || '' // Fallback to empty string if value is null
          }
        }));
      }
    } else {
      // Handle regular fields
      setUpdateData((prevData) => ({
        ...prevData,
        [name]: formattedValue || '' // Fallback to empty string if value is null
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
      setUpdateData((prevData) => ({
        ...prevData,
        shipping_address: { ...prevData.billing_address }
      }));
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    let formErrors = {};

    Object.keys(updateData).forEach((name) => {
      const value = updateData[name];
      const error = handleValidation(name, value);
      if (error) {
        formErrors[name] = error;
      }
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      axios
        .put(`${config.apiUrl}/leads/updateFlwLeadForEmp/${data.follow_id}`, updateData)
        .then((res) => {
          console.log('Data Updated Successfully.', res);
          onClose();
        })
        .catch((err) => {
          console.log('Data update failed', err);
        });
    }
  };

  return (
    <div>
      <Grid container spacing={3}>
        {/* Existing fields */}
        <Grid item xs={6}>
          <TextField fullWidth name="leads_name" label="Lead Name" value={updateData.leads_name || ''} onChange={handleChangeInput} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth name="leads_mobile" label="Lead Mobile" value={updateData.leads_mobile || ''} onChange={handleChangeInput} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth name="leads_email" label="Lead Email" value={updateData.leads_email || ''} onChange={handleChangeInput} />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="leads_company"
            label="Lead Company"
            value={updateData.leads_company || ''}
            onChange={handleChangeInput}
          />
        </Grid>

        {/* GST Field */}
        <Grid item xs={6}>
          <TextField fullWidth name="gst_number" label="GST Number" value={updateData.gst_number || ''} onChange={handleChangeInput} />
        </Grid>

        {/* Billing Address */}
        <Grid item xs={12}>
          <h3>Billing Address</h3>
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="billing_address.door_number"
            label="Door Number"
            value={updateData.billing_address.door_number || ''}
            onChange={handleChangeInput}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="billing_address.street"
            label="Street"
            value={updateData.billing_address.street || ''}
            onChange={handleChangeInput}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="billing_address.landMark"
            label="Land Mark"
            value={updateData.billing_address.landMark || ''}
            onChange={handleChangeInput}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="billing_address.city"
            label="City"
            value={updateData.billing_address.city || ''}
            onChange={handleChangeInput}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="billing_address.state"
            label="State"
            value={updateData.billing_address.state || ''}
            onChange={handleChangeInput}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="billing_address.pincode"
            label="Pincode"
            value={updateData.billing_address.pincode || ''}
            onChange={handleChangeInput}
          />
        </Grid>

        {/* Shipping Address */}
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={isAddressSame} onChange={handleAddressSameToggle} />}
            label="Same as Billing Address"
          />
        </Grid>
        <Grid item xs={12}>
          <h3>Shipping Address</h3>
          {updateData.reminder_date}
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="shipping_address.door_number"
            label="Door Number"
            value={updateData.shipping_address.door_number || ''}
            onChange={handleChangeInput}
            disabled={isAddressSame}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="shipping_address.street"
            label="Street"
            value={updateData.shipping_address.street || ''}
            onChange={handleChangeInput}
            disabled={isAddressSame}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="shipping_address.landMark"
            label="Land Mark"
            value={updateData.shipping_address.landMark || ''}
            onChange={handleChangeInput}
            disabled={isAddressSame}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="shipping_address.city"
            label="City"
            value={updateData.shipping_address.city || ''}
            onChange={handleChangeInput}
            disabled={isAddressSame}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="shipping_address.state"
            label="State"
            value={updateData.shipping_address.state || ''}
            onChange={handleChangeInput}
            disabled={isAddressSame}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            name="shipping_address.pincode"
            label="Pincode"
            value={updateData.shipping_address.pincode || ''}
            onChange={handleChangeInput}
            disabled={isAddressSame}
          />
        </Grid>

        {/* Existing fields */}
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="Call_Discussion"
            label="Leads Query"
            value={updateData.Call_Discussion || ''}
            onChange={handleChangeInput}
            error={!!errors.Call_Discussion}
            helperText={errors.Call_Discussion}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            select
            name="remember"
            label="Remember"
            value={updateData.remember || ''}
            onChange={handleChangeInput}
            error={!!errors.remember}
            helperText={errors.remember}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        {updateData.remember === 'Yes' && (
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="reminder_date"
              label="Reminder Date"
              type="date"
              value={updateData.reminder_date || ''}
              onChange={handleChangeInput}
              error={!!errors.reminder_date}
              helperText={errors.reminder_date}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        )}

        <Grid item xs={12} display="flex" justifyContent="center">
          <Button onClick={handleUpdate}>Update</Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default UpdateFlwLeads;
