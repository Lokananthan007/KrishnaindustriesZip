import { Button, Grid, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../../../config';

const AddSales = ({ onClose }) => {
  const [proData, setProData] = useState([]);
  const [formData, setFormData] = useState({
    pro_id: '',
    sale_address: '',
    quantity: '',
    price: '',
    gst: '',
    total: ''
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
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  useEffect(() => {
    const { quantity, price, gst } = formData;
    if (quantity && price && gst) {
      const total = (Number(quantity) * Number(price) * (1 + Number(gst) / 100)).toFixed(2);
      setFormData((prevFormData) => ({ ...prevFormData, total }));
      setErrors((prevErrors) => ({ ...prevErrors, total: '' })); // Clear the total error
    }
  }, [formData.quantity, formData.price, formData.gst]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErr = {};

    Object.keys(formData).forEach((name) => {
      const value = formData[name];
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
      .post(`${config.apiUrl}/sales/saveSales`, formData)
      .then((res) => {
        onClose();
      })
      .catch((err) => {
        console.log('Sales Data is not added.', err);
      });
  };

  const handleClear = () => {
    setFormData({
      pro_id: '',
      sale_address: '',
      quantity: '',
      price: '',
      gst: '',
      total: ''
    });
    setErrors({
      pro_id: '',
      sale_address: '',
      quantity: '',
      price: '',
      gst: '',
      total: ''
    });
  };

  return (
    <>
      <h1 className="text-center">Add Sales</h1>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            select
            name="pro_id"
            label="Product Name"
            value={formData.pro_id}
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
            value={formData.sale_address}
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
            value={formData.quantity}
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
            value={formData.price}
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
            value={formData.gst}
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
            value={formData.total}
            onChange={handleChangeInput}
            error={!!errors.total}
            helperText={errors.total}
            disabled
          />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="center">
          <Button onClick={handleSubmit}>Submit</Button>
          <Button onClick={handleClear} style={{ marginLeft: '20px' }}>
            Clear
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default AddSales;
