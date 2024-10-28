import React, { useEffect, useState, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  Snackbar,
  Alert,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Select,
  MenuItem
} from '@mui/material';
import axios from 'axios';
import config from '../../../config';
import logo from '../../../images/Krishna Industries.jpeg';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AdminCustPurchIndex = () => {
  const [customerInvoiceData, setCustomerInvoiceData] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]); // For storing filtered invoices
  const [searchQuery, setSearchQuery] = useState(''); // For search input
  const [dateRange, setDateRange] = useState({ from: '', to: '' }); // For date range filter
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [openDeliveryDialog, setOpenDeliveryDialog] = useState(false);
  const [courierDetails, setCourierDetails] = useState({
    courierName: '',
    deliveryCode: '',
    deliveryStatus: ''
  });
  const pdfRef = useRef(null);
  const empId = sessionStorage.getItem('emp_id');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const deliveryStatusOptions = ['Pending', 'Shipped', 'In Transit', 'Delivered'];

  const fromDetails = {
    company: 'Krishna Industry',
    phone: '9171585789',
    email: 'email@example.com',
    address:
      'Sri Venkateshwara Industrial Estate, No. 338/D2C, Balaguru Garden West, Peelamedu, Opposite Fun Mall, Peelamedu, Near NISE School, Coimbatore, Tamil Nadu, India, 641004',
    gst: '33BLDPS3889N1ZB'
  };

  useEffect(() => {
    axios
      .get(`${config.apiUrl}/cust_purch/getCustomerInvoices`)
      .then((response) => {
        setCustomerInvoiceData(response.data);
        setFilteredInvoices(response.data); // Set filtered invoices initially
      })
      .catch((error) => {
        console.error('Error fetching customer and invoice data:', error);
      });
  }, [empId]);

  const fetchProducts = async () => {
    if (customerInvoiceData.length > 0) {
      try {
        const response = await axios.get(`${config.apiUrl}/product/getProductData`);
        setAllProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedInvoice]);

  // Handle form input changes for delivery details
  const handleCourierDetailsChange = (event) => {
    setCourierDetails({
      ...courierDetails,
      [event.target.name]: event.target.value
    });
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    filterInvoices(event.target.value, dateRange.from, dateRange.to);
  };

  // Handle date range input changes
  const handleDateRangeChange = (event) => {
    const { name, value } = event.target;
    const updatedDateRange = { ...dateRange, [name]: value };
    setDateRange(updatedDateRange);
    filterInvoices(searchQuery, updatedDateRange.from, updatedDateRange.to);
  };

  // Function to filter invoices based on search query and date range
  const filterInvoices = (query, from, to) => {
    let filtered = customerInvoiceData;

    // Filter by search query
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      filtered = filtered.filter((invoice) => {
        return (
          invoice.leads_name.toLowerCase().includes(lowerCaseQuery) ||
          invoice.leads_email.toLowerCase().includes(lowerCaseQuery) ||
          invoice.leads_mobile.toLowerCase().includes(lowerCaseQuery) ||
          invoice.invoice_number.toString().includes(lowerCaseQuery)
        );
      });
    }

    // Filter by date range
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      filtered = filtered.filter((invoice) => {
        const invoiceDate = new Date(invoice.invoice_date);
        return invoiceDate >= fromDate && invoiceDate <= toDate;
      });
    }

    setFilteredInvoices(filtered);
  };

  // Open Invoice Preview Dialog
  const handleOpenInvoiceDialog = (invoiceData) => {
    setSelectedInvoice(invoiceData);
    setOpenInvoiceDialog(true);
  };

  // Close Invoice Preview Dialog
  const handleCloseInvoiceDialog = () => {
    setOpenInvoiceDialog(false);
    setSelectedInvoice(null);
  };

  // Open Delivery Details Dialog
  const handleOpenDeliveryDialog = (invoiceData) => {
    setSelectedInvoice(invoiceData);
    setOpenDeliveryDialog(true);
  };

  // Close Delivery Details Dialog
  const handleCloseDeliveryDialog = () => {
    setOpenDeliveryDialog(false);
    setSelectedInvoice(null);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Submit courier details
  const handleSubmitCourierDetails = () => {
    if (selectedInvoice) {
      const { courierName, deliveryCode, deliveryStatus } = courierDetails;
      axios
        .post(`${config.apiUrl}/cust_purch/addDelivery`, {
          invoiceNumber: selectedInvoice.invoice_number,
          courierName,
          deliveryCode,
          deliveryStatus
        })
        .then((response) => {
          setOpenDeliveryDialog(false); // Close the dialog after submission
          setCourierDetails({ courierName: '', deliveryCode: '', deliveryStatus: '' });
          setSnackbarMessage('Courier details added successfully!');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        })
        .catch((error) => {
          console.error('Error adding courier details:', error);
          setSnackbarMessage('Error adding courier details.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        });
    }
  };

  // Generate PDF
  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    const headerHeight = 20;
    const footerHeight = 15;

    html2canvas(pdfRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Header Section
      doc.setFillColor(0, 0, 139);
      doc.rect(0, 0, doc.internal.pageSize.width, headerHeight, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('Helvetica', 'bold');
      doc.text('Invoice Document', doc.internal.pageSize.width / 2, 10, { align: 'center', baseline: 'middle' });

      // Add the canvas image to the PDF below the header
      doc.addImage(imgData, 'PNG', 10, headerHeight + 5, 190, 0);

      // Footer Section
      const pageHeight = doc.internal.pageSize.height;
      doc.setFillColor(0, 0, 139);
      doc.rect(0, pageHeight - footerHeight, doc.internal.pageSize.width, footerHeight, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text('© 2024 Krishna Industry | All rights reserved', doc.internal.pageSize.width / 2, pageHeight - 5, {
        align: 'center',
        baseline: 'middle'
      });

      // Save the generated PDF
      doc.save(`Invoice-${selectedInvoice.invoice_number}.pdf`);
    });
  };

  return (
    <>
      {/* Search and Date Range Filters */}
      <h1 className="text-center">Customer Purchase Index</h1>
      <Grid container spacing={2} style={{ padding: '20px' }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name, email, mobile, or invoice number"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="From Date"
            type="date"
            name="from"
            value={dateRange.from}
            onChange={handleDateRangeChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="To Date"
            type="date"
            name="to"
            value={dateRange.to}
            onChange={handleDateRangeChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Employee</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Invoice Number</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Invoice Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{data.emp_name}</TableCell>
                  <TableCell>{data.leads_name}</TableCell>
                  <TableCell>{data.leads_mobile}</TableCell>
                  <TableCell>{data.leads_email}</TableCell>
                  <TableCell>{data.leads_company}</TableCell>
                  <TableCell>{data.leads_city}</TableCell>
                  <TableCell>{data.leads_state}</TableCell>
                  <TableCell>{data.invoice_number}</TableCell>
                  <TableCell>{data.total_with_tax}</TableCell>
                  <TableCell>{new Date(data.invoice_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenInvoiceDialog(data)}
                      style={{ marginRight: '10px' }}
                    >
                      Show Invoice
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handleOpenDeliveryDialog(data)}>
                      Add Delivery
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No customer or invoice data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Invoice Preview Dialog */}
      <Dialog open={openInvoiceDialog} onClose={handleCloseInvoiceDialog} maxWidth="md" fullWidth>
        <DialogTitle>Invoice Preview</DialogTitle>
        <DialogContent dividers>
          {selectedInvoice ? (
            <div
              ref={pdfRef}
              style={{
                padding: '10px',
                backgroundColor: '#ffffff',
                borderRadius: '8px'
              }}
            >
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={3}>
                  <img src={logo} alt="Company Logo" style={{ width: '120px', height: 'auto' }} />
                </Grid>
                <Grid item xs={6} style={{ textAlign: 'right' }}>
                  <Typography variant="h6">Invoice No: {selectedInvoice.invoice_number}</Typography>
                  <Typography variant="h6">Date: {new Date(selectedInvoice.invoice_date).toLocaleDateString()}</Typography>
                  <Typography variant="h6">Payment Type: {selectedInvoice.payment_type}</Typography>
                  {selectedInvoice.payment_type !== 'Cash' && (
                    <Typography variant="h6">Transaction Id: {selectedInvoice.transactionId}</Typography>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={2} style={{ paddingTop: '15px' }}>
                <Grid item xs={6} style={{ textAlign: 'left' }}>
                  <Typography variant="h4" gutterBottom>
                    From
                  </Typography>
                  <Typography>{fromDetails.company}</Typography>
                  <Typography>Phone: {fromDetails.phone}</Typography>
                  <Typography>Email: {fromDetails.email}</Typography>
                  <Typography>Address: {fromDetails.address}</Typography>
                  <Typography>GST NO: {fromDetails.gst}</Typography>
                </Grid>
                <Grid item xs={6} style={{ textAlign: 'left' }}>
                  <Typography variant="h4" gutterBottom>
                    To
                  </Typography>
                  <Typography>{selectedInvoice.leads_name}</Typography>
                  <Typography>Company: {selectedInvoice.leads_company}</Typography>
                  <Typography>Phone: {selectedInvoice.leads_mobile}</Typography>
                  <Typography>Email: {selectedInvoice.leads_email}</Typography>
                  <Typography>GST No: {selectedInvoice.gst_number}</Typography>
                </Grid>
              </Grid>

              <Grid container spacing={3} style={{ borderWidth: '2px', borderColor: 'black', paddingTop: '15px' }}>
                {/* Billing Address */}

                <Grid item xs={6}>
                  <Typography variant="h4">Billing Address</Typography>
                  <Typography variant="h6">
                    {selectedInvoice.billing_door_number || 'N/A'},<br /> {selectedInvoice.billing_street || 'N/A'},{' '}
                    {selectedInvoice.billing_landMark || 'N/A'}, <br />
                    {selectedInvoice.billing_city || 'N/A'},<br /> {selectedInvoice.billing_state || 'N/A'} -{' '}
                    {selectedInvoice.billing_pincode || 'N/A'}
                  </Typography>
                </Grid>

                {/* Shipping Address */}
                <Grid item xs={6}>
                  <Typography variant="h4">Shipping Address</Typography>

                  <Typography variant="h6">
                    {selectedInvoice.billing_door_number || 'N/A'}, <br />
                    {selectedInvoice.billing_street || 'N/A'}, {selectedInvoice.billing_landMark || 'N/A'}, <br />
                    {selectedInvoice.billing_city || 'N/A'}, <br />
                    {selectedInvoice.billing_state || 'N/A'} - {selectedInvoice.billing_pincode || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>

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
                    {selectedInvoice.product_details.map((product, index) => {
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
                </Table>
              </TableContainer>
              <Grid item xs={6} sm={3} margin={'15px'} marginTop={'20px'}>
                <Typography variant="h4" align="right" margin={'3px'}>
                  Totals Section
                </Typography>
                <Grid container direction="column">
                  <Grid item container justifyContent="space-between">
                    <Typography variant="h6" style={{ textAlign: 'right', flex: 1 }}>
                      Total (without tax)
                    </Typography>
                    <Typography variant="h6" style={{ textAlign: 'right', flex: 0.1 }}>
                      {selectedInvoice.total_without_tax}
                    </Typography>
                  </Grid>
                  <Grid item container justifyContent="space-between">
                    <Typography variant="h6" style={{ textAlign: 'right', flex: 1 }}>
                      Discount
                    </Typography>
                    <Typography variant="h6" style={{ textAlign: 'right', flex: 0.1 }}>
                      {selectedInvoice.discountType === 'percentage' ? `${selectedInvoice.discount}%` : `₹${selectedInvoice.discount}`}
                    </Typography>
                  </Grid>
                  <Grid item container justifyContent="space-between">
                    <Typography variant="h6" style={{ textAlign: 'right', flex: 1 }}>
                      GST
                    </Typography>
                    <Typography variant="h6" style={{ textAlign: 'right', flex: 0.1 }}>
                      {selectedInvoice.gst}%
                    </Typography>
                  </Grid>
                  <Grid item container justifyContent="space-between">
                    <Typography variant="h4" style={{ textAlign: 'right', flex: 1 }}>
                      Total (with tax)
                    </Typography>
                    <Typography variant="h4" style={{ textAlign: 'right', flex: 0.1 }}>
                      {selectedInvoice.total_with_tax}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          ) : (
            <Typography>No invoice data available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInvoiceDialog}>Close</Button>
          <Button onClick={handleGeneratePDF} color="primary">
            Generate PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delivery Details Dialog */}
      <Dialog open={openDeliveryDialog} onClose={handleCloseDeliveryDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Delivery Details</DialogTitle>
        <DialogContent>
          <div>
            <Typography variant="h6">Invoice No: {selectedInvoice?.invoice_number}</Typography>
            <TextField
              label="Courier Name"
              name="courierName"
              value={courierDetails.courierName}
              onChange={handleCourierDetailsChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Delivery Code"
              name="deliveryCode"
              value={courierDetails.deliveryCode}
              onChange={handleCourierDetailsChange}
              fullWidth
              margin="normal"
            />
            <Select
              label="Delivery Status"
              name="deliveryStatus"
              value={courierDetails.deliveryStatus}
              onChange={handleCourierDetailsChange}
              fullWidth
              displayEmpty
              margin="normal"
            >
              <MenuItem value="" disabled>
                Select Status
              </MenuItem>
              {deliveryStatusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeliveryDialog}>Cancel</Button>
          <Button onClick={handleSubmitCourierDetails} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminCustPurchIndex;
