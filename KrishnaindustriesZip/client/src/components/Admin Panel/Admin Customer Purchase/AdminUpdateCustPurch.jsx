// new

import { Button, Grid, MenuItem, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config';

const AdminUpdateCustPurch = ({ data, onClose }) => {
  const [proData, setProData] = useState([]);
  const [custData, setCustData] = useState([]);
  const [updateData, setUpdateData] = useState({
    cust_id: data ? data.cust_id : '',
    pro_id: data ? data.pro_id : '',
    quantity: data ? data.quantity : '',
    price: data ? data.price : '',
    payment_type: data ? data.payment_type : '',
    advance: data ? data.advance : '',
    balance: data ? data.balance : '',
    total: data ? data.total : ''
  });
  const [errors, setErrors] = useState({
    cust_id: '',
    pro_id: '',
    quantity: '',
    price: '',
    payment_type: '',
    advance: '',
    balance: '',
    total: ''
  });

  useEffect(() => {
    axios
      .get(`${config.apiUrl}/product/getProductData`)
      .then((res) => {
        setProData(res.data);
      })
      .catch((err) => {
        console.log('Customer purchase data is not fetched.');
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${config.apiUrl}/customer/getCustomerForAdmin`)
      .then((res) => {
        setCustData(res.data);
      })
      .catch((err) => {
        console.log('Customer data is not fetched.');
      });
  }, []);

  const handleValidation = (name, value) => {
    let errmsg = '';
    const trimmedValue = value && typeof value === 'string' ? value.trim() : value;
    switch (name) {
      case 'pro_id':
        if (!trimmedValue) {
          errmsg = 'Product name is required.';
        }
        break;
      case 'quantity':
        if (!trimmedValue) {
          errmsg = 'Quantity is required.';
        }
        break;
      case 'price':
        if (!trimmedValue) {
          errmsg = 'Price is required.';
        }
        break;
      case 'payment_type':
        if (!trimmedValue) {
          errmsg = 'Payment type is required.';
        }
        break;
      case 'advance':
        if (!trimmedValue) {
          errmsg = 'Advance amount is required.';
        }
        break;
      case 'balance':
        if (!trimmedValue) {
          errmsg = 'balance amount is required.';
        }
        break;
      case 'total':
        if (!trimmedValue) {
          errmsg = 'Total amount is required.';
        }
        break;
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    let updatedUpdateData = { ...updateData, [name]: value };

    // Calculate balance amount if payment_type is 'partial'
    if (name === 'payment_type' && value === 'partial') {
      const total = parseFloat(updatedUpdateData.total || 0);
      const advance = parseFloat(updatedUpdateData.advance || 0);
      updatedUpdateData.balance = (total - advance).toFixed(2);
    } else if (name === 'advance') {
      const total = parseFloat(updatedUpdateData.total || 0);
      const advance = parseFloat(value || 0);
      updatedUpdateData.balance = (total - advance).toFixed(2);
    } else if (name === 'quantity' || name === 'price') {
      const quantity = parseFloat(updatedUpdateData.quantity || 0);
      const price = parseFloat(updatedUpdateData.price || 0);
      updatedUpdateData.total = (quantity * price).toFixed(2);
    }

    const error = handleValidation(name, value);

    setUpdateData(updatedUpdateData);
    setErrors({ ...errors, [name]: error });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    let formErr = {};
    Object.keys(updateData).forEach((name) => {
      const value = updateData[name];
      const error = handleValidation(name, value);
      if (error) {
        formErr = error;
      }
    });

    if (Object.keys(formErr).length > 0) {
      setErrors(formErr);
      return;
    }

    axios
      .put(`${config.apiUrl}/cust_purch/updateCustPurch/${data.cust_purch_id}`, updateData)
      .then((res) => {
        onClose();
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  };
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            select
            fullWidth
            name="cust_id"
            label="Select customer"
            onChange={handleChangeInput}
            value={updateData.cust_id}
            error={!!errors.cust_id}
            helperText={errors.cust_id}
          >
            {custData.map((cust) => (
              <MenuItem key={cust.cust_id} value={cust.cust_id}>
                {cust.cust_name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={6}>
          <TextField
            select
            fullWidth
            name="pro_id"
            label="Select Product Name"
            onChange={handleChangeInput}
            value={updateData.pro_id}
            error={!!errors.pro_id}
            helperText={errors.pro_id}
          >
            {proData.map((pro) => (
              <MenuItem key={pro.pro_id} value={pro.pro_id}>
                {pro.pro_name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="quantity"
            label="Quantity"
            type="number"
            onChange={handleChangeInput}
            value={updateData.quantity}
            error={!!errors.quantity}
            helperText={errors.quantity}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="price"
            label="Price"
            type="number"
            onChange={handleChangeInput}
            value={updateData.price}
            error={!!errors.price}
            helperText={errors.price}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            select
            fullWidth
            name="payment_type"
            label="Select Payment type"
            onChange={handleChangeInput}
            value={updateData.payment_type}
            error={!!errors.payment_type}
            helperText={errors.payment_type}
          >
            <MenuItem value="full">Full Payment</MenuItem>
            <MenuItem value="partial">Partial Payment</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="total"
            label="Total"
            type="number"
            onChange={handleChangeInput}
            value={updateData.total}
            error={!!errors.total}
            helperText={errors.total}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="advance"
            label="Amount"
            type="number"
            onChange={handleChangeInput}
            value={updateData.advance}
            error={!!errors.advance}
            helperText={errors.advance}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            name="balance"
            label="Balance Amount"
            type="number"
            onChange={handleChangeInput}
            value={updateData.balance}
            error={!!errors.balance}
            helperText={errors.balance}
          />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="center">
          <Button onClick={handleUpdate}>Submit</Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminUpdateCustPurch;
