import React, { useEffect, useState, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField
} from '@mui/material';
import axios from 'axios';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import logo from '../../../images/Krishna Industries.jpeg';
import config from '../../../config';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const ProformaHistory = () => {
  const navigate = useNavigate();
  const emp_id = sessionStorage.getItem('emp_id');
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setfilteredInvoices] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subTotal, setSubTotal] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDialog, setOpenDialog] = useState(false);
  const pdfRef = useRef();
  const [searchInput, setSearchInput] = useState('');
  const formattedDate = invoices.proforma_date ? format(new Date(invoices.proforma_date), 'dd/MM/yyyy') : '';
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const fromDetails = {
    company: 'Krishna Industry',
    phone: '9171585789',
    email: 'email@example.com',
    address:
      'Sri Venkateshwara Industrial Estate, No. 338/D2C, Balaguru Garden West, Peelamedu, Opposite Fun Mall, Peelamedu, Near NISE School, Coimbatore, Tamil Nadu, India, 641004',
    gst: '33BLDPS3889N1ZB'
  };

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/quotation/proformaHistory/${emp_id}`);
      setInvoices(response.data);
      const productDetails = response.data.product_details;
      setProducts(productDetails);
      if (Array.isArray(productDetails)) {
        setProducts(productDetails);
        calculateTotal(productDetails); // Pass the productDetails to calculate the total
      } else {
        setProducts([]); // Set an empty array if productDetails is not valid
      }
    } catch (err) {
      setSnackbarMessage('Error fetching invoice data');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    if (invoices.length > 0) {
      try {
        const response = await axios.get(`${config.apiUrl}/product/getProductData`);
        setAllProducts(response.data);
      } catch (err) {
        setSnackbarMessage('Failed to fetch products');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchProducts();
  }, [selectedInvoice]);

  // Date filtering logic
  useEffect(() => {
    if (!startDate && !endDate && !selectedMonth) {
      setfilteredInvoices(invoices);
    } else {
      let filteredData = invoices;

      // Filter by date range
      if (startDate && endDate) {
        filteredData = filteredData.filter((p) => {
          const proformaDate = new Date(p.proforma_date);
          return proformaDate >= startDate && proformaDate <= endDate;
        });
      }

      // Filter by month
      if (selectedMonth) {
        const month = selectedMonth.getMonth();
        const year = selectedMonth.getFullYear();
        filteredData = filteredData.filter((p) => {
          const proformaDate = new Date(p.proforma_date);
          return proformaDate.getMonth() === month && proformaDate.getFullYear() === year;
        });
      }

      setfilteredInvoices(filteredData);
    }
  }, [startDate, endDate, selectedMonth, invoices]);

  const calculateTotal = (productDetails) => {
    if (!Array.isArray(productDetails)) return;

    let total = productDetails.reduce((acc, product) => {
      const price = parseFloat(product.price) || 0;
      const quantity = parseInt(product.quantity) || 0;

      console.log(`'Price:', ${price}, 'Quantity:', ${quantity}`); // Debugging line

      const productTotal = price * quantity;
      return acc + productTotal;
    }, 0);

    setSubTotal(total);
  };

  useEffect(() => {
    calculateTotal();
  }, [products]);

  const handleOpenDialog = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedInvoice(null);
  };

  // Generate PDF
  // Generate PDF
  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    // Define heights for header and footer
    const headerHeight = 20;
    const footerHeight = 15;

    // Convert the content in pdfRef to canvas
    html2canvas(pdfRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Header Section
      doc.setFillColor(0, 0, 139); // Dark blue color
      doc.rect(0, 0, doc.internal.pageSize.width, headerHeight, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('Helvetica', 'bold');
      doc.text('Proforma', doc.internal.pageSize.width / 2, 10, { align: 'center' });

      // Add the canvas image to the PDF below the header
      doc.addImage(imgData, 'PNG', 10, headerHeight + 5, 190, 0);

      // Add the Terms & Conditions text to the PDF
      const termsConditions = "Your terms and conditions go here."; // Define or pass your terms and conditions
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text('Terms & Conditions:', 10, headerHeight + canvas.height + 15);
      const termsLines = doc.splitTextToSize(termsConditions, doc.internal.pageSize.width - 20);
      doc.text(termsLines, 10, headerHeight + canvas.height + 25);

      // Footer Section
      const pageHeight = doc.internal.pageSize.height;
      doc.setTextColor(0, 255, 0);
      doc.setFontSize(14);
      doc.text('Thanks for your Business with Us !!! Visit Again !!!', doc.internal.pageSize.width / 2, pageHeight - footerHeight - 10, {
        align: 'center'
      });

      doc.setFillColor(0, 0, 139); // Dark blue color for footer
      doc.rect(0, pageHeight - footerHeight, doc.internal.pageSize.width, footerHeight, 'F'); // Draw filled rectangle for footer
      doc.setTextColor(255, 255, 255); // Set text color to white for footer
      doc.setFontSize(10); // Set font size for footer
      doc.text('© 2024 Krishna Industry | All rights reserved', doc.internal.pageSize.width / 2, pageHeight - 5, {
        align: 'center'
      }); // Centered footer text

      // Save the generated PDF
      doc.save(`Proforma-${selectedInvoice.proforma_number}.pdf`);
    });
  };

  // Search handler function
  const handleSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  // Filter invoices based on the single search input
  const filteredBySearch = filteredInvoices.filter((invoice) => {
    const searchTerm = searchInput.toLowerCase();
    return invoice.proforma_number.toLowerCase().includes(searchTerm) || invoice.leads_name.toLowerCase().includes(searchTerm);
  });

  const handleCancelFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedMonth(null);
    setfilteredInvoices(invoices); // Reset to full data
  };
  const handleOptionClick = (option, leadId, quotationnumber) => {
    navigate(`/${option}/${leadId}/${quotationnumber}`);
  };
  return (
    <Container>
      <Typography variant="h1" align="center" justifyContent="center" marginBottom="20px">
        Proforma History
      </Typography>
      {/* Search and Date/Month Filters */}
      <Grid container spacing={3} style={{ marginBottom: '20px' }}>
        <Grid item xs={12} md={4}>
          <TextField label="Search by Proforma Number" variant="outlined" value={searchInput} onChange={handleSearchInput} fullWidth />
        </Grid>

        {/* Date Range Filter */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid item xs={12} md={4}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>

          {/* Monthly Filter */}
          <Grid item xs={12} md={4}>
            <DatePicker
              views={['year', 'month']}
              label="Select Month"
              value={selectedMonth}
              onChange={(newValue) => setSelectedMonth(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
        </LocalizationProvider>
        <Grid item xs={12} md={4}>
          <Button variant="contained" color="secondary" onClick={handleCancelFilters} fullWidth>
            Cancel Filters
          </Button>
        </Grid>
      </Grid>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Proforma Number</TableCell>
                <TableCell>Lead Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>Convert</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.proforma_number}>
                  <TableCell>
                    {new Date(invoice.proforma_date).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short', // 'short' for abbreviated month names
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true // Ensures AM/PM format
                    })}
                  </TableCell>
                  <TableCell>{invoice.proforma_number}</TableCell>
                  <TableCell>{invoice.leads_name}</TableCell>
                  <TableCell>₹{invoice.total_with_tax}</TableCell>

                  <TableCell>
                    <Button onClick={() => handleOpenDialog(invoice)}>View Details</Button>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '5vw' }}>
                      <Button
                        color="secondary"
                        onClick={() => handleOptionClick('invoiceConvert2', invoice.follow_id, invoice.proforma_number)}
                      >
                        Invoice
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog for Invoice Preview */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Proforma Preview</DialogTitle>
        <DialogContent dividers>
          {selectedInvoice && (
            <div
              ref={pdfRef}
              style={{
                padding: '10px',
                backgroundColor: '#ffffff',
                borderRadius: '8px'
              }}
            >
              <Grid container alignItems="center" justifyContent="space-between">
                {/* Logo on the left */}
                <Grid item xs={3}>
                  <img src={logo} alt="Company Logo" style={{ width: '120px', height: 'auto' }} />
                </Grid>
                {/* Quotation number and date on the right */}
                <Grid item xs={6} style={{ textAlign: 'right' }}>
                  <Typography variant="h6">Proforma No: {selectedInvoice.proforma_number}</Typography>
                  <Typography variant="h6">Date: {selectedInvoice.proforma_date}</Typography>
                 
                </Grid>
              </Grid>

              {/* From Section */}
              <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                <Grid item xs={6} style={{ textAlign: 'left' }}>
                  <Typography variant="h3" marginTop="15px" gutterBottom>
                    From
                  </Typography>
                  <Typography variant="h3">{fromDetails.company}</Typography>
                  <Typography variant="h6">Phone: {fromDetails.phone}</Typography>
                  <Typography variant="h6">Email: {fromDetails.email}</Typography>
                  <Typography variant="h6">Address: {fromDetails.address}</Typography>
                  <Typography variant="h6">GST NO: {fromDetails.gst}</Typography>
                </Grid>

                {/* To Section */}
                <Grid item xs={6} style={{ textAlign: 'left' }}>
                  <Typography variant="h3" marginTop="15px" gutterBottom>
                    To
                  </Typography>
                  <Typography variant="h3">{selectedInvoice.leads_name}</Typography>
                  <Typography variant="h5">Company: {selectedInvoice.leads_company}</Typography>
                  <Typography variant="h6">Phone: {selectedInvoice.leads_mobile}</Typography>
                  <Typography variant="h6">Email: {selectedInvoice.leads_email}</Typography>
                  <Typography variant="h6">GST No :{selectedInvoice.gst_number}</Typography>
                </Grid>
              </Grid>

              {/* Addresses Section */}
              <Grid container spacing={3} style={{ paddingTop: '15px' }}>
                <Grid item xs={6}>
                  <Typography variant="h4">Billing Address</Typography>
                  <Typography variant="h6">
                    {selectedInvoice.billing_door_number || 'N/A'},<br />
                    {selectedInvoice.billing_street || 'N/A'}, {selectedInvoice.billing_landMark || 'N/A'},<br />
                    {selectedInvoice.billing_city || 'N/A'}, {selectedInvoice.billing_state || 'N/A'} -{' '}
                    {selectedInvoice.billing_pincode || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="h4">Shipping Address</Typography>
                  <Typography variant="h6">
                    {selectedInvoice.shipping_door_number || 'N/A'},<br />
                    {selectedInvoice.shipping_street || 'N/A'}, {selectedInvoice.shipping_landMark || 'N/A'},<br />
                    {selectedInvoice.shipping_city || 'N/A'}, {selectedInvoice.shipping_state || 'N/A'} -{' '}
                    {selectedInvoice.shipping_pincode || 'N/A'}
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
                      <TableCell>HSN No</TableCell>
                      <TableCell>Desccription</TableCell>
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
                          <TableCell>{product.hsn}</TableCell>
                          <TableCell>{product.description}</TableCell>
                          <TableCell>{parseFloat(product.price) * parseInt(product.quantity)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Totals Section */}
              <Grid item xs={6} sm={3} margin={'15px'} marginTop={'20px'}>
                <Typography variant="h4" align="right" margin={'3px'}>
                  Totals Section :
                </Typography>
                <Grid container direction="column">
                  <Grid item container justifyContent="space-between">
                    <Typography variant="h6" style={{ textAlign: 'right', flex: 1 }}>
                      Total (without tax) :
                    </Typography>
                    <Typography variant="h6" style={{ textAlign: 'right', flex: 0.1 }}>
                      {selectedInvoice.total_without_tax}
                    </Typography>
                  </Grid>
                  <Grid item container justifyContent="space-between">
                    <Typography variant="h6" style={{ textAlign: 'right', flex: 1 }}>
                      Discount :
                    </Typography>
                    <Typography variant="h6" style={{ textAlign: 'right', flex: 0.1 }}>
                      {selectedInvoice.discountType === 'percentage'
                        ? `${selectedInvoice.discount || 0}%`
                        : `₹${selectedInvoice.discount || 0}`}
                    </Typography>
                  </Grid>
                  <Grid item container justifyContent="space-between">
                    <Typography variant="h6" style={{ textAlign: 'right', flex: 1 }}>
                      Paid Amount :
                    </Typography>
                    <Typography variant="h6" style={{ textAlign: 'right', flex: 0.1 }}>
                      {selectedInvoice.paidAmount || 0}
                    </Typography>
                  </Grid>
                  <Grid item container justifyContent="space-between">
                    <Typography variant="h6" style={{ textAlign: 'right', flex: 1 }}>
                      Balance Amount :
                    </Typography>
                    <Typography variant="h6" style={{ textAlign: 'right', flex: 0.1 }}>
                      {selectedInvoice.balance || 0}
                    </Typography>
                  </Grid>
                  <Grid container spacing={2}>
                    {selectedInvoice.gst > 0 && (
                      <Grid item container justifyContent="space-between">
                        <Typography variant="h6" style={{ textAlign: 'right', flex: 1 }}>
                          GST :
                        </Typography>
                        <Typography variant="h6" style={{ textAlign: 'right', flex: 0.1 }}>
                          {selectedInvoice.gst}%
                        </Typography>
                      </Grid>
                    )}

                    {selectedInvoice.igst > 0 && (
                      <Grid item container justifyContent="space-between">
                        <Typography variant="h6" style={{ textAlign: 'right', flex: 1 }}>
                          IGST :
                        </Typography>
                        <Typography variant="h6" style={{ textAlign: 'right', flex: 0.1 }}>
                          {selectedInvoice.igst}%
                        </Typography>
                      </Grid>
                    )}
                  </Grid>

                  {(selectedInvoice.gst > 0 || selectedInvoice.igst > 0) && (
                    <Grid item container justifyContent="space-between">
                      <Typography variant="h4" style={{ textAlign: 'right', flex: 1 }}>
                        {`Total (with tax)   :`}
                      </Typography>
                      <Typography variant="h5" style={{ textAlign: 'right', flex: 0.1 }}>
                        {selectedInvoice.total_with_tax}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </div>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button onClick={handleGeneratePDF}>Download PDF</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for error messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ProformaHistory;
