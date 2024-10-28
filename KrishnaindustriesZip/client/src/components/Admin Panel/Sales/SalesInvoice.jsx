//new

import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import logo from '../../../images/logo (1).png';
import moment from 'moment';

// PrintLayout component for the print-specific layout
const PrintLayout = ({ data, dueDate }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
    <Typography variant="h4" align="center" style={{ marginBottom: '20px' }}>
      Invoice
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} display="flex" justifyContent="end">
        <img src={logo} alt="Company Logo" width="100" height="100" />
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h6" style={{ fontWeight: 'bold' }}>
          From
        </Typography>
        <Typography>{data.purch_address}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h6" style={{ fontWeight: 'bold' }}>
          To
        </Typography>
        <Typography>Krishna Industries</Typography>
        <Typography>Peelamedu, Singanallur</Typography>
        <Typography>Coimbatore, 627757</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h6" style={{ display: 'inline-block', marginRight: '20px' }}>
          <span style={{ fontWeight: 'bold' }}>Invoice Date &nbsp; &nbsp;: </span> {moment().format('YYYY-MM-DD')}
        </Typography>
        <Typography variant="h6" style={{ display: 'inline-block', marginTop: '2px' }}>
          <span style={{ fontWeight: 'bold' }}>Due Date &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; :</span> {moment(dueDate).format('YYYY-MM-DD')}
        </Typography>
      </Grid>
    </Grid>
    <TableContainer style={{ marginTop: '20px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold' }}>S.No</TableCell>
            <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold' }}>Product Name</TableCell>
            <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold' }}>Description</TableCell>
            <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold' }}>Quantity</TableCell>
            <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold' }}>Price</TableCell>
            <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold' }}>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell style={{ border: '1px solid #ddd' }}>01</TableCell>
            <TableCell style={{ border: '1px solid #ddd' }}>{data.pro_name}</TableCell>
            <TableCell style={{ border: '1px solid #ddd' }}>{data.specification}</TableCell>
            <TableCell style={{ border: '1px solid #ddd' }}>{data.quantity}</TableCell>
            <TableCell style={{ border: '1px solid #ddd' }}>{data.price}</TableCell>
            <TableCell style={{ border: '1px solid #ddd' }}>{data.total}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', textAlign: 'right' }}>
      <Typography className="mt-2" variant="h6">
        {' '}
        <span style={{ fontWeight: 'bold' }}>Price</span> : {data.price}
      </Typography>
      <Typography className="mt-2" variant="h6">
        {' '}
        <span style={{ fontWeight: 'bold' }}>GST 18%</span> : {data.gst}
      </Typography>
      <Typography className="mt-2" variant="h6">
        {' '}
        <span style={{ fontWeight: 'bold' }}>Total</span> : {data.total}
      </Typography>
    </div>
  </div>
);

const SalesInvoice = ({ data }) => {
  const [dueDate, setDueDate] = useState(null);

  const handlePrint = () => {
    // Hide the print button to avoid it being printed
    const printButton = document.getElementById('printButton');
    if (printButton) {
      printButton.style.display = 'none';
    }
    // Trigger printing
    window.print();
    // Show the print button again after printing is done
    if (printButton) {
      printButton.style.display = 'block';
    }
  };

  return (
    <>
      {dueDate ? (
        <>
          <PrintLayout data={data} dueDate={dueDate} />
          <Button id="printButton" onClick={handlePrint} style={{ display: 'block', margin: '20px auto' }}>
            Print
          </Button>
        </>
      ) : (
        <TextField
          label="Due Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setDueDate(e.target.value)}
          value={dueDate}
        />
      )}
    </>
  );
};

export default SalesInvoice;
