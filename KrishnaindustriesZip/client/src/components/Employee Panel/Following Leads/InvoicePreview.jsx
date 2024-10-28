import React, { useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button
} from '@mui/material';

const InvoicePreview = ({
  openDialog,
  handleCloseDialog,
  invoiceNumber,
  formattedDate,
  payment_type,
  transactionId,
  fromDetails,
  toDetails,
  products,
  allProducts,
  subTotal,
  totalWithoutTax,
  discount,
  gst,
  totalWithTax,
  handleGeneratePDF,
  logo
}) => {
  const pdfRef = useRef(null);

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle>Invoice Preview</DialogTitle>
      <DialogContent dividers>
        <div
          ref={pdfRef}
          style={{
            padding: '10px',
            backgroundColor: '#ffffff',
            borderRadius: '8px'
          }}
        >
          {/* Header Section with Logo, Invoice Number, Date */}
          <Grid container alignItems="center" justifyContent="space-between">
            {/* Logo */}
            <Grid item xs={3}>
              <img src={logo} alt="Company Logo" style={{ width: '120px', height: 'auto' }} />
            </Grid>
            {/* Invoice Details */}
            <Grid item xs={6} style={{ textAlign: 'right' }}>
              <Typography variant="h6">Invoice No: {invoiceNumber}</Typography>
              <Typography variant="h6">Date: {formattedDate}</Typography>
              <Typography variant="h6">Payment Type: {payment_type}</Typography>
              {payment_type !== 'Cash' && <Typography variant="h6">Transaction Id: {transactionId}</Typography>}
            </Grid>
          </Grid>

          {/* From and To Sections */}
          <Grid container alignItems="center" justifyContent="space-between" spacing={2} style={{ marginTop: '15px' }}>
            {/* From Details */}
            <Grid item xs={6}>
              <Typography variant="h6" gutterBottom>
                From
              </Typography>
              <Typography variant="body1">{fromDetails.company}</Typography>
              <Typography variant="body1">Phone: {fromDetails.phone}</Typography>
              <Typography variant="body1">Email: {fromDetails.email}</Typography>
              <Typography variant="body1">Address: {fromDetails.address}</Typography>
              <Typography variant="body1">GST NO: {fromDetails.gst}</Typography>
            </Grid>
            {/* To Details */}
            <Grid item xs={6}>
              <Typography variant="h6" gutterBottom>
                To
              </Typography>
              <Typography variant="body1">{toDetails.leads_name}</Typography>
              <Typography variant="body1">Company: {toDetails.leads_company}</Typography>
              <Typography variant="body1">Phone: {toDetails.leads_mobile}</Typography>
              <Typography variant="body1">Email: {toDetails.leads_email}</Typography>
              <Typography variant="body1">GST No: {toDetails.gst_number}</Typography>
            </Grid>
          </Grid>

          {/* Billing and Shipping Address */}
          <Grid container spacing={3} style={{ marginTop: '15px' }}>
            {/* Billing Address */}
            <Grid item xs={6}>
              <Typography variant="h6">Billing Address</Typography>
              <Typography variant="body1">
                {toDetails.billing_door_number || 'N/A'},<br />
                {toDetails.billing_street || 'N/A'}, {toDetails.billing_landMark || 'N/A'},<br />
                {toDetails.billing_city || 'N/A'},<br />
                {toDetails.billing_state || 'N/A'} - {toDetails.billing_pincode || 'N/A'}
              </Typography>
            </Grid>
            {/* Shipping Address */}
            <Grid item xs={6}>
              <Typography variant="h6">Shipping Address</Typography>
              <Typography variant="body1">
                {toDetails.billing_door_number || 'N/A'},<br />
                {toDetails.billing_street || 'N/A'}, {toDetails.billing_landMark || 'N/A'},<br />
                {toDetails.billing_city || 'N/A'},<br />
                {toDetails.billing_state || 'N/A'} - {toDetails.billing_pincode || 'N/A'}
              </Typography>
            </Grid>
          </Grid>

          {/* Product Details Table */}
          <TableContainer style={{ marginTop: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Sub Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, index) => {
                  const matchedProduct = allProducts.find((p) => p.pro_id === product.pro_id);
                  return (
                    <TableRow key={index}>
                      <TableCell>{matchedProduct ? matchedProduct.pro_name : 'Unknown Product'}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{parseFloat(product.price) * parseInt(product.quantity)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableRow>
                <TableCell colSpan={4} align="right">
                  <Typography variant="h6">Sub Total: {subTotal}</Typography>
                </TableCell>
              </TableRow>
            </Table>
          </TableContainer>

          {/* Totals Section */}
          <Grid item xs={6} sm={3} style={{ marginTop: '20px', marginLeft: 'auto' }}>
            <Typography variant="h6" align="right">
              Totals
            </Typography>
            <Grid container direction="column" spacing={1}>
              <Grid item container justifyContent="space-between">
                <Typography variant="body1">Total (without tax)</Typography>
                <Typography variant="body1">{totalWithoutTax}</Typography>
              </Grid>
              <Grid item container justifyContent="space-between">
                <Typography variant="body1">Discount</Typography>
                <Typography variant="body1">{discount.type === 'percentage' ? `${discount.value}%` : `₹${discount.value}`}</Typography>
              </Grid>
              <Grid item container justifyContent="space-between">
                <Typography variant="body1">GST</Typography>
                <Typography variant="body1">{gst}%</Typography>
              </Grid>
              <Grid item container justifyContent="space-between">
                <Typography variant="h6">Total (with tax)</Typography>
                <Typography variant="h6">{totalWithTax}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions>
        <Button onClick={handleCloseDialog}>Close</Button>
        <Button onClick={handleGeneratePDF}>Download PDF</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoicePreview;
