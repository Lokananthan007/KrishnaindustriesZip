// new

import React, { useEffect, useState, useRef } from 'react';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button } from '@mui/material';
import logo from '../../../images/Krishna Industries.jpeg';
import moment from 'moment';
import axios from 'axios';
import config from '../../../config';

// Function to calculate GST and total amount
const calculateGST = (price, gstRate) => {
  return (price * gstRate) / 100;
};

const PurchaseInvoice = ({ data = {}, dueDate }) => {
  const [invoiceData, setInvoiceData] = useState(data);

  const gstRate = 18; // GST rate in percentage

  // Split data fields that are comma-separated into arrays
  const productNames = invoiceData.product_names ? invoiceData.product_names.split(',') : [];
  const quantities = invoiceData.quantities ? invoiceData.quantities.split(',') : [];
  const prices = invoiceData.prices ? invoiceData.prices.split(',') : [];
  const totalAmounts = prices.map((price, index) => {
    const parsedPrice = parseFloat(price) || 0;
    return parsedPrice * (parseFloat(quantities[index]) || 0);
  });

  const totalPrice = totalAmounts.reduce((acc, amount) => acc + amount, 0);
  const gstAmount = calculateGST(totalPrice, gstRate);
  const grandTotal = totalPrice + gstAmount;

  // Reference to the print button
  const printButtonRef = useRef(null);

  const handlePrint = () => {
    // Hide the print button
    if (printButtonRef.current) {
      printButtonRef.current.style.display = 'none';
    }

    // Print the document
    window.print();

    // After printing, show the print button again
    setTimeout(() => {
      if (printButtonRef.current) {
        printButtonRef.current.style.display = 'block';
      }
    }, 100);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', backgroundColor: '#e8f5e9', padding: '20px', borderRadius: '8px' }}>
      <Typography variant="h4" align="center" style={{ marginBottom: '20px', color: '#4CAF50' }}>
        Customer Purchase Invoice
      </Typography>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} container justifyContent="flex-end">
          <img src={logo} alt="Company Logo" width="100" height="50" />
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6" style={{ fontWeight: 'bold', color: '#2196F3' }}>
            From
          </Typography>
          <Typography>Krishna Industries</Typography>
          <Typography>Peelamedu, Singanallur</Typography>
          <Typography>Coimbatore, 627757</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6" style={{ fontWeight: 'bold', color: '#2196F3' }}>
            To
          </Typography>
          <Typography>{invoiceData.cust_name || 'N/A'}</Typography>
          <Typography>{invoiceData.cust_mobile || 'N/A'}</Typography>
          <Typography>{invoiceData.cust_email || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">
            <span style={{ fontWeight: 'bold', color: '#2196F3' }}>Invoice Date: </span>{' '}
            {moment(invoiceData.created_at).format('YYYY-MM-DD')}
          </Typography>
          <Typography variant="h6" style={{ marginTop: '8px' }}>
            <span style={{ fontWeight: 'bold', color: '#2196F3' }}>Due Date: </span> {moment().add(2, 'days').format('YYYY-MM-DD')}
          </Typography>
        </Grid>
      </Grid>
      <TableContainer style={{ marginTop: '20px' }}>
        <Table>
          <TableHead style={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', padding: '8px' }}>S.No</TableCell>
              <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', padding: '8px' }}>Product Name</TableCell>
              <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', padding: '8px' }}>Quantity</TableCell>
              <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', padding: '8px' }}>Price</TableCell>
              <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', padding: '8px' }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productNames.map((productName, index) => (
              <TableRow key={index}>
                <TableCell style={{ border: '1px solid #ddd', padding: '8px' }}>{index + 1}</TableCell>
                <TableCell style={{ border: '1px solid #ddd', padding: '8px' }}>{productName}</TableCell>
                <TableCell style={{ border: '1px solid #ddd', padding: '8px' }}>{quantities[index] || 'N/A'}</TableCell>
                <TableCell style={{ border: '1px solid #ddd', padding: '8px' }}>{parseFloat(prices[index]).toFixed(2) || '0.00'}</TableCell>
                <TableCell style={{ border: '1px solid #ddd', padding: '8px' }}>{totalAmounts[index].toFixed(2) || '0.00'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '10px', textAlign: 'right' }}>
        <Typography variant="h6" style={{ marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', color: '#FF5722' }}>Subtotal: </span> {totalPrice.toFixed(2)}
        </Typography>
        <Typography variant="h6" style={{ marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', color: '#FF5722' }}>GST 18%: </span> {gstAmount.toFixed(2)}
        </Typography>
        <Typography variant="h6" style={{ marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', color: '#FF5722' }}>Total: </span> {grandTotal.toFixed(2)}
        </Typography>
      </div>
      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>Thank you for your business!</p>
      <Button variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={handlePrint} ref={printButtonRef}>
        Print Invoice
      </Button>
    </div>
  );
};

export default PurchaseInvoice;
