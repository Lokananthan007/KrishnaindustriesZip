import { Button, Grid, TextField, InputAdornment } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import config from '../../../config';

const AddPurchase = ({ onClose }) => {
  const [purchaseData, setPurchaseData] = useState({
    pro_name: '',
    specification: '',
    purch_address: '',
    quantity: '',
    price: '',
    total: '',
    gst: 16, // Default GST is set to 16
    cgst: 8,
    sgst: 8
  });

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    const newData = { ...purchaseData, [name]: value };
    setPurchaseData(newData);

    if (name === 'price' || name === 'quantity' || name === 'gst') {
      calculateTotal(newData);
    }
  };

  const calculateTotal = (data) => {
    const quantity = parseFloat(data.quantity) || 0;
    const price = parseFloat(data.price) || 0;
    const gst = parseFloat(data.gst) || 0;

    const totalBeforeGst = quantity * price;

    const cgst = Math.round((totalBeforeGst * gst) / 200);
    const sgst = Math.round((totalBeforeGst * gst) / 200);

    const total = Math.round(totalBeforeGst + cgst + sgst);

    setPurchaseData({ ...data, total, cgst, sgst });
  };

  const handleAddPurchase = (e) => {
    e.preventDefault();
    axios
      .post(`${config.apiUrl}/purchase/savePurchase`, purchaseData)
      .then((res) => {
        onClose();
      })
      .catch((err) => {
        console.log('Purchase Data is not added.', err);
      });
  };

  return (
    <div>
      <h1 className="text-center">Add Purchase</h1>
      <Grid container spacing={3} className="mt-3">
        <Grid item xs={6}>
          <TextField fullWidth name="pro_name" label="Product Name" onChange={handleChangeInput} value={purchaseData.pro_name} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth name="specification" label="Specification" onChange={handleChangeInput} value={purchaseData.specification} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth name="purch_address" label="Address" onChange={handleChangeInput} value={purchaseData.purch_address} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth name="quantity" label="Quantity" type="number" onChange={handleChangeInput} value={purchaseData.quantity} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth name="price" label="Price" type="number" onChange={handleChangeInput} value={purchaseData.price} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth name="gst" label="GST" type="number" onChange={handleChangeInput} value={purchaseData.gst} />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="total"
            label="Total"
            type="number"
            value={purchaseData.total}
            disabled
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="cgst"
            label="CGST"
            type="number"
            value={purchaseData.cgst}
            disabled
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="sgst"
            label="SGST"
            type="number"
            value={purchaseData.sgst}
            disabled
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="center">
          <Button onClick={handleAddPurchase}>Submit</Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddPurchase;
