import React, { useRef } from 'react';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button } from '@mui/material';
import logo from '../../../images/Krishna Industries2.jpeg';
import moment from 'moment';

// Function to calculate GST and total amount
const calculateGST = (price, gstRate) => {
  return (price * gstRate) / 100;
};

const PurchaseInvoice = ({ data, dueDate }) => {
  const gstRate = 18; // GST rate in percentage
  const price = parseFloat(data.price) || 0;
  const gstAmount = calculateGST(price, gstRate);
  const total = price + gstAmount;

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
        Purchase Invoice
      </Typography>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} container justifyContent="flex-end">
          <img src={logo} alt="Company Logo" width="100" height="100" />
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6" style={{ fontWeight: 'bold', color: '#2196F3' }}>
            From
          </Typography>
          <Typography>Krishna</Typography>
          <Typography>Peelamedu, Singanallur</Typography>
          <Typography>Coimbatore, 627757</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6" style={{ fontWeight: 'bold', color: '#2196F3' }}>
            To
          </Typography>
          <Typography>{data.purch_address}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">
            <span style={{ fontWeight: 'bold', color: '#2196F3' }}>Invoice Date: </span> {moment().format('YYYY-MM-DD')}
          </Typography>
          <Typography variant="h6" style={{ marginTop: '8px' }}>
            <span style={{ fontWeight: 'bold', color: '#2196F3' }}>Due Date: </span> {moment(dueDate).format('YYYY-MM-DD')}
          </Typography>
        </Grid>
      </Grid>
      <TableContainer style={{ marginTop: '20px' }}>
        <Table>
          <TableHead style={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', padding: '8px' }}>S.No</TableCell>
              <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', padding: '8px' }}>Product Name</TableCell>
              <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', padding: '8px' }}>Description</TableCell>
              <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', padding: '8px' }}>Quantity</TableCell>
              <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', padding: '8px' }}>Price</TableCell>
              <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', padding: '8px' }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell style={{ border: '1px solid #ddd', padding: '8px' }}>01</TableCell>
              <TableCell style={{ border: '1px solid #ddd', padding: '8px' }}>{data.pro_name}</TableCell>
              <TableCell style={{ border: '1px solid #ddd', padding: '8px' }}>{data.specification}</TableCell>
              <TableCell style={{ border: '1px solid #ddd', padding: '8px' }}>{data.quantity}</TableCell>
              <TableCell style={{ border: '1px solid #ddd', padding: '8px' }}>{price.toFixed(2)}</TableCell>
              <TableCell style={{ border: '1px solid #ddd', padding: '8px' }}>{total.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: '200px', borderTop: '1px solid #ddd', paddingTop: '10px', textAlign: 'right' }}>
        <Typography variant="h6" style={{ marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', color: '#FF5722' }}>Price: </span> {price.toFixed(2)}
        </Typography>
        <Typography variant="h6" style={{ marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', color: '#FF5722' }}>GST 18%: </span> {gstAmount.toFixed(2)}
        </Typography>
        <Typography variant="h6" style={{ marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', color: '#FF5722' }}>Total: </span> {total.toFixed(2)}
        </Typography>
      </div>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>Thank you for your business.</p>
      <Button
        ref={printButtonRef}
        onClick={handlePrint}
        style={{ display: 'block', margin: '20px auto', backgroundColor: '#4CAF50', color: 'white' }}
      >
        Print Invoice
      </Button>
    </div>
  );
};

export default PurchaseInvoice;
