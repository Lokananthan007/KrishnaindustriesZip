// new
import { Button, Grid, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../../../config';

const UpdateSales = ({ onClose, data }) => {
  const [proData, setProData] = useState([]);
  const [updateData, setUpdateData] = useState({
    pro_id: data ? data.pro_id : '',
    sale_address: data ? data.sale_address : '',
    quantity: data ? data.quantity : '',
    price: data ? data.price : '',
    gst: data ? data.gst : '',
    total: data ? data.total : ''
  });
  const [errors, setErrors] = useState({
    pro_id: '',
    sale_address: '',
    quantity: '',
    price: '',
    gst: '',
    total: ''
  });

  useEffect(() => {
    axios
      .get(`${config.apiUrl}/product/getProductData`)
      .then((res) => {
        setProData(res.data);
      })
      .catch((err) => {
        console.log('Product Data is not fetched.', err);
      });
  }, []);

  const handleValidation = (name, value) => {
    let errmsg = '';
    const trimmedValue = value && typeof value === 'string' ? value.trim() : value;
    switch (name) {
      case 'pro_id':
        if (!trimmedValue) {
          errmsg = 'Product Name is Required';
        }
        break;
      case 'sale_address':
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
      .put(`${config.apiUrl}/sales/update/${data.sale_id}`, updateData)
      .then((res) => {
        onClose();
      })
      .catch((err) => {
        console.log('Sales Data is not added.', err);
      });
  };

  return (
    <>
      <h1 className="text-center">Add Purchase</h1>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            select
            name="pro_id"
            label="Product Name"
            value={updateData.pro_id}
            onChange={handleChangeInput}
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
            name="sale_address"
            label="Address"
            value={updateData.sale_address}
            onChange={handleChangeInput}
            error={!!errors.sale_address}
            helperText={errors.sale_address}
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
            name="gst"
            label="GST"
            type="number"
            value={updateData.gst}
            onChange={handleChangeInput}
            error={!!errors.gst}
            helperText={errors.gst}
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

        <Grid item xs={12} display="flex" justifyContent="center">
          <Button onClick={handleUpdate}>Update</Button>
        </Grid>
      </Grid>
    </>
  );
};

export default UpdateSales;
