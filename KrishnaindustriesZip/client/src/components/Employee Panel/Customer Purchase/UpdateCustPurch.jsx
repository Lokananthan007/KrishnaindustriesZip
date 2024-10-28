// src/components/UpdatePurch.js

import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, DialogActions, DialogContent, DialogTitle, Dialog } from '@mui/material';
import axios from 'axios';
import config from '../../../config';

const UpdatePurch = ({ updateData, onClose }) => {
  const [formData, setFormData] = useState({
    cust_id: '',
    cust_name: '',
    cust_mobile: '',
    cust_email: '',
    product_names: '',
    quantities: '',
    prices: '',
    payment_type: '',
    payment_amount: '',
    balance: '',
    total: ''
  });

  const [productMap, setProductMap] = useState({}); // For storing product name to ID mapping

  useEffect(() => {
    if (updateData) {
      setFormData({
        cust_id: updateData.cust_id || '',
        cust_name: updateData.cust_name || '',
        cust_mobile: updateData.cust_mobile || '',
        cust_email: updateData.cust_email || '',
        product_names: Array.isArray(updateData.product_names) ? updateData.product_names.join(', ') : updateData.product_names || '',
        quantities: Array.isArray(updateData.quantities) ? updateData.quantities.join(', ') : updateData.quantities || '',
        prices: Array.isArray(updateData.prices) ? updateData.prices.join(', ') : updateData.prices || '',
        payment_type: updateData.payment_type || '',
        payment_amount: updateData.payment_amount || '',
        balance: updateData.balance || '',
        total: updateData.total || ''
      });

      // Fetch the product name to ID mapping from the backend
      axios
        .get(`${config.apiUrl}/products`)
        .then((response) => {
          const productData = response.data;
          const map = productData.reduce((acc, product) => {
            acc[product.name] = product.id; // Assuming the product has 'name' and 'id' fields
            return acc;
          }, {});
          setProductMap(map);
        })
        .catch((err) => console.error('Error fetching product data:', err));
    }
  }, [updateData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = () => {
    const { product_names, quantities, prices, ...rest } = formData;

    // Convert comma-separated product names to product IDs
    const productIds = product_names ? product_names.split(',').map((name) => productMap[name.trim()] || null) : [];
    const productQuantities = quantities ? quantities.split(',').map((qty) => qty.trim()) : [];
    const productPrices = prices ? prices.split(',').map((price) => price.trim()) : [];

    // Combine arrays into a single object
    const products = {
      pro_id: productIds,
      quantity: productQuantities,
      price: productPrices
    };

    const updatedData = { ...rest, ...products };

    axios
      .put(`${config.apiUrl}/cust_purch/updateCustPurch/${updateData.cust_purch_id}`, updatedData)
      .then((res) => {
        onClose();
      })
      .catch((err) => {
        console.error('Error updating data. Please try again later.', err);
      });
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Update Purchase</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Customer Name"
              name="cust_name"
              value={formData.cust_name}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Customer Mobile"
              name="cust_mobile"
              value={formData.cust_mobile}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Customer Email"
              name="cust_email"
              value={formData.cust_email}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Product Names (comma separated)"
              name="product_names"
              value={formData.product_names}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quantities (comma separated)"
              name="quantities"
              value={formData.quantities}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Prices (comma separated)"
              name="prices"
              value={formData.prices}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Payment Type"
              name="payment_type"
              value={formData.payment_type}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Payment Amount"
              name="payment_amount"
              value={formData.payment_amount}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Balance" name="balance" value={formData.balance} onChange={handleChange} variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Total" name="total" value={formData.total} onChange={handleChange} variant="outlined" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleUpdate} color="primary">
          Update
        </Button>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePurch;
