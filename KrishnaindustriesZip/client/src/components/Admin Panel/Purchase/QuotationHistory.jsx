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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import logo from '../../../images/Krishna Industries.jpeg';
import config from '../../../config';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const AdminQuotationHistory = () => {
  const navigate = useNavigate();

  const [quotation, setQuotations] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subTotal, setSubTotal] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDialog, setOpenDialog] = useState(false);
  const pdfRef = useRef();
  const [searchInput, setSearchInput] = useState('');
  const formattedDate = quotation.quotation_date ? format(new Date(quotation.quotation_date), 'dd/MM/yyyy') : '';

  const fromDetails = {
    company: 'Krishna Industry',
    phone: '9171585789',
    email: 'email@example.com',
    address:
      'Sri Venkateshwara Industrial Estate, No. 338/D2C, Balaguru Garden West, Peelamedu, Opposite Fun Mall, Peelamedu, Near NISE School, Coimbatore, Tamil Nadu, India, 641004',
    gst: '33BLDPS3889N1ZB'
  };

  const fetchQuotations = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/quotation/quotationHistory`);
      setQuotations(response.data);
      const productDetails = response.data.product_details;
      setProducts(productDetails);
      if (Array.isArray(productDetails)) {
        setProducts(productDetails);
        calculateTotal(productDetails); // Pass the productDetails to calculate the total
      } else {
        setProducts([]); // Set an empty array if productDetails is not valid
      }
    } catch (err) {
      setSnackbarMessage('Error fetching quotation data');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    if (quotation.length > 0) {
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
    fetchQuotations();
    fetchProducts();
  }, [selectedQuotation]);

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

  const handleOpenDialog = (quotation) => {
    setSelectedQuotation(quotation);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedQuotation(null);
  };

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
      doc.text('Quotation', doc.internal.pageSize.width / 2, 10, { align: 'center', baseline: 'middle' });

      // Add the canvas image to the PDF below the header
      doc.addImage(imgData, 'PNG', 10, headerHeight + 5, 190, 0);

      // Footer Section
      const pageHeight = doc.internal.pageSize.height;
      doc.setFillColor(0, 0, 139); // Dark blue color for footer
      doc.rect(0, pageHeight - footerHeight, doc.internal.pageSize.width, footerHeight, 'F'); // Draw filled rectangle for footer
      doc.setTextColor(255, 255, 255); // Set text color to white for footer
      doc.setFontSize(10); // Set font size for footer
      doc.text('© 2024 Krishna Industry | All rights reserved', doc.internal.pageSize.width / 2, pageHeight - 5, {
        align: 'center',
        baseline: 'middle'
      }); // Centered footer text

      // Save the generated PDF
      doc.save(`Quotation-${selectedQuotation.quotation_number}.pdf`);
    });
  };

  // Search handler function
  const handleSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  // Filter quotation based on the single search input
  const filteredQuotations = quotation.filter((quotation) => {
    const searchTerm = searchInput.toLowerCase();
    return quotation.quotation_number.toLowerCase().includes(searchTerm) || quotation.leads_name.toLowerCase().includes(searchTerm);
  });

  const handleOptionClick = (option, leadId, quotationnumber) => {
    navigate(`/${option}/${leadId}/${quotationnumber}`);
  };
  return (
    <Container>
      <Typography variant="h1" align="center" justifyContent="center" marginBottom="20px">
        Quotation History
      </Typography>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <TextField label="Search by Quotation Number" variant="outlined" value={searchInput} onChange={handleSearchInput} />
      </div>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Quotation Number</TableCell>
                <TableCell>Lead Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>convert</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredQuotations.map((quotation) => (
                <TableRow key={quotation.quotation_number}>
                  {/* <TableCell>
                    {new Date(quotation.quotation_date).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short', // 'short' for abbreviated month names
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true // Ensures AM/PM format
                    })}
                  </TableCell> */}

                  <TableCell>{quotation.quotation_number}</TableCell>
                  <TableCell>{quotation.leads_name}</TableCell>
                  <TableCell>₹{quotation.total_with_tax}</TableCell>

                  <TableCell>
                    <Button onClick={() => handleOpenDialog(quotation)}>View Details</Button>
                  </TableCell>

                  <TableCell>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '5vw' }}>
                      <Button
                        color="primary"
                        onClick={() => handleOptionClick('proformaConvert', quotation.follow_id, quotation.quotation_number)}
                        style={{ marginBottom: '10px' }} // Add space between the buttons
                      >
                        Proforma
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => handleOptionClick('invoiceConvert', quotation.follow_id, quotation.quotation_number)}
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
      {/* Dialog for Quotation Preview */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Quotation Preview</DialogTitle>
        <DialogContent dividers>
          {selectedQuotation && (
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
                  <Typography variant="h6">Quotation No: {selectedQuotation.quotation_number}</Typography>
                  {/* <Typography variant="h6">Date: {selectedQuotation.quotation_date}</Typography> */}
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
                  <Typography variant="h3">{selectedQuotation.leads_name}</Typography>
                  <Typography variant="h5">Company: {selectedQuotation.leads_company}</Typography>
                  <Typography variant="h6">Phone: {selectedQuotation.leads_mobile}</Typography>
                  <Typography variant="h6">Email: {selectedQuotation.leads_email}</Typography>
                  <Typography variant="h6">GST No :{selectedQuotation.gst_number}</Typography>
                </Grid>
              </Grid>

              {/* Addresses Section */}
              <Grid container spacing={3} style={{ paddingTop: '15px' }}>
                <Grid item xs={6}>
                  <Typography variant="h4">Billing Address</Typography>
                  <Typography variant="h6">
                    {selectedQuotation.billing_door_number || 'N/A'},<br />
                    {selectedQuotation.billing_street || 'N/A'}, {selectedQuotation.billing_landMark || 'N/A'},<br />
                    {selectedQuotation.billing_city || 'N/A'}, {selectedQuotation.billing_state || 'N/A'} -{' '}
                    {selectedQuotation.billing_pincode || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="h4">Shipping Address</Typography>
                  <Typography variant="h6">
                    {selectedQuotation.shipping_door_number || 'N/A'},<br />
                    {selectedQuotation.shipping_street || 'N/A'}, {selectedQuotation.shipping_landMark || 'N/A'},<br />
                    {selectedQuotation.shipping_city || 'N/A'}, {selectedQuotation.shipping_state || 'N/A'} -{' '}
                    {selectedQuotation.shipping_pincode || 'N/A'}
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
                    {selectedQuotation.product_details.map((product, index) => {
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

              {/* Totals Section */}
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
                      {selectedQuotation.total_without_tax}
                    </Typography>
                  </Grid>
                  <Grid item container justifyContent="space-between">
                    <Typography variant="h6" style={{ textAlign: 'right', flex: 1 }}>
                      Discount
                    </Typography>
                    <Typography variant="h6" style={{ textAlign: 'right', flex: 0.1 }}>
                      {selectedQuotation.discountType === 'percentage'
                        ? `${selectedQuotation.discount}%`
                        : `₹${selectedQuotation.discount}`}
                    </Typography>
                  </Grid>
                  <Grid item container justifyContent="space-between">
                    <Typography variant="h6" style={{ textAlign: 'right', flex: 1 }}>
                      GST
                    </Typography>
                    <Typography variant="h6" style={{ textAlign: 'right', flex: 0.1 }}>
                      {selectedQuotation.gst}%
                    </Typography>
                  </Grid>
                  <Grid item container justifyContent="space-between">
                    <Typography variant="h4" style={{ textAlign: 'right', flex: 1 }}>
                      Total (with tax)
                    </Typography>
                    <Typography variant="h4" style={{ textAlign: 'right', flex: 0.1 }}>
                      {selectedQuotation.total_with_tax}
                    </Typography>
                  </Grid>
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

export default AdminQuotationHistory;
