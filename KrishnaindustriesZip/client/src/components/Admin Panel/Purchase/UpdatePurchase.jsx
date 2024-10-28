// new
import { Button, Grid, TextField } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import config from '../../../config';

const UpdatePurchase = ({ data, onClose }) => {
  const [updateData, setUpdateData] = useState({
    pro_name: data ? data.pro_name : '',
    specification: data ? data.specification : '',
    purch_address: data ? data.purch_address : '',
    quantity: data ? data.quantity : '',
    price: data ? data.price : '',
    total: data ? data.total : '',
    gst: data ? data.gst : ''
  });
  const [errors, setErrors] = useState({
    pro_name: '',
    specification: '',
    purch_address: '',
    quantity: '',
    price: '',
    total: '',
    gst: ''
  });
  const handleValidation = (name, value) => {
    let errmsg = '';
    const trimmedValue = value && typeof value === 'string' ? value.trim() : value;
    switch (name) {
      case 'pro_name':
        if (!trimmedValue) {
          errmsg = 'Product Name is Required';
        }
        break;
      case 'specification':
        if (!trimmedValue) {
          errmsg = 'Specification is Required';
        }
        break;
      case 'purch_address':
        if (!trimmedValue) {
          errmsg = 'Address is Required';
        }
        break;
      case 'quantity':
        if (!trimmedValue) {
          errmsg = 'Quantity is Required';
        }
        break;
      case 'price':
        if (!trimmedValue) {
          errmsg = 'Price is Required';
        }
        break;
      case 'total':
        if (!trimmedValue) {
          errmsg = 'Total is Required';
        }
        break;
      case 'gst':
        if (!trimmedValue) {
          errmsg = 'GST is Required';
        }
        break;
      default:
        break;
    }
    return errmsg;
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    const error = handleValidation(name, value);
    setUpdateData({ ...updateData, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    let formErr = {};

    Object.keys(updateData).forEach((name) => {
      const value = updateData[name];
      const error = handleValidation(name, value);
      if (error) {
        formErr[name] = error;
      }
    });

    if (Object.keys(formErr).length > 0) {
      setErrors(formErr);
      return;
    }

    axios
      .put(`${config.apiUrl}/purchase/update/${data.purch_id}`, updateData)
      .then((res) => {
        onClose();
      })
      .catch((err) => {
        console.log('Purchase Data is not added.', err);
      });
  };
  const handleClear = () => {
    setUpdateData({
      pro_name: '',
      specification: '',
      purch_address: '',
      quantity: '',
      price: '',
      total: '',
      gst: ''
    });
    setErrors({
      pro_name: '',
      specification: '',
      purch_address: '',
      quantity: '',
      price: '',
      total: '',
      gst: ''
    });
  };
  return (
    <>
      <h1 className="text-center">Add Purchase</h1>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="pro_name"
            label="Product Name"
            value={updateData.pro_name}
            onChange={handleChangeInput}
            error={!!errors.pro_name}
            helperText={errors.pro_name}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="specification"
            label="Specification"
            value={updateData.specification}
            onChange={handleChangeInput}
            error={!!errors.specification}
            helperText={errors.specification}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="purch_address"
            label="Address"
            value={updateData.purch_address}
            onChange={handleChangeInput}
            error={!!errors.purch_address}
            helperText={errors.purch_address}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="quantity"
            label="Quantity"
            type="number"
            value={updateData.quantity}
            onChange={handleChangeInput}
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
            value={updateData.price}
            onChange={handleChangeInput}
            error={!!errors.price}
            helperText={errors.price}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="total"
            label="Total"
            type="number"
            value={updateData.total}
            onChange={handleChangeInput}
            error={!!errors.total}
            helperText={errors.total}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="gst"
            label="GST"
            type="number"
            value={updateData.gst}
            onChange={handleChangeInput}
            error={!!errors.gst}
            helperText={errors.gst}
          />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="center">
          <Button onClick={handleUpdate}>Update</Button>
          <Button onClick={handleClear} style={{ marginLeft: '20px' }}>
            Clear
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default UpdatePurchase;
