import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Button,
  Paper,
  Snackbar,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Typography,
  Select,
  InputLabel
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import config from '../../../config';
import logo from '../../../images/Krishna Industries.jpeg';
import QuotationBackGround from '../../../images/QuotationBackground.png';
import { Text } from 'recharts';
import { format } from 'date-fns';

const InvoicePage = () => {
  const { follow_id } = useParams();
  const pdfRef = useRef(); // Reference to the PDF content
  const [openDialog, setOpenDialog] = useState(false); // Dialog state for PDF preview

  const fromDetails = {
    company: 'Krishna Industry',
    phone: '9171585789',
    email: 'email@example.com',
    address:
      'Sri Venkateshwara Industrial Estate, No. 338/D2C, Balaguru Garden West, Peelamedu, Opposite Fun Mall, Peelamedu, Near NISE School, Coimbatore, Tamil Nadu, India, 641004',
    gst: '33BLDPS3889N1ZB'
  };
  const [invoiceList, setInvoiceList] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [toDetails, setToDetails] = useState({});
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [termsConditions, setTermsConditions] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [products, setProducts] = useState([{ pro_id: '', quantity: '', price: '' }]);
  const [allProducts, setAllProducts] = useState([]);
  const [discount, setDiscount] = useState({ type: 'percentage', value: '' });
  const [payment_type, setPayment_type] = useState('Cash');
  const [transactionId, setTransactionId] = useState('');
  const [gst, setGst] = useState('');
  const [igst, setIgst] = useState('');
  const [isGstReadOnly, setIsGstReadOnly] = useState(false);
  const [isIgstReadOnly, setIsIgstReadOnly] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [success, setSuccess] = useState();
  const [totalWithoutTax, setTotalWithoutTax] = useState(0);
  const [totalWithTax, setTotalWithTax] = useState(0);
  const [PaidAmount, setPaidAmount] = useState(0);
  const [previousPaidAmount, setPreviousPaidAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const formattedDate = invoiceDate ? format(new Date(invoiceDate), 'dd/MM/yyyy') : '';

  useEffect(() => {
    if (follow_id) {
      setLoading(true);
      axios
        .get(`${config.apiUrl}/quotation/quotation/${follow_id}`)
        .then((res) => {
          setToDetails(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching lead data:', err);
          setSnackbarMessage('Failed to fetch lead details');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          setLoading(false);
        });
    }
  }, [follow_id]);

  const fetchDefaultInvoiceData = () => {
    if (toDetails.leads_id) {
      axios
        .get(`${config.apiUrl}/quotation/quotation/leads/${toDetails.leads_id}`)
        .then((res) => {
          setProducts(res.data.product_details);
          setInvoiceDate(res.data.invoice_date);
          setInvoiceNumber(res.data.invoice_number);
          setPayment_type(res.data.payment_type);
          setTransactionId(res.data.transactionId);
          setTotalWithTax(res.data.total_with_tax);
          setTotalWithoutTax(res.data.total_without_tax);
          setPreviousPaidAmount(parseFloat(res.data.paidAmount).toFixed(2)); // Store existing paid amount as decimal
          setPaidAmount(0); // Reset for new payments
          setBalance(parseFloat(res.data.balance));
          setGst(res.data.gst);
          setIgst(res.data.igst);
          setDiscount({
            type: res.data.discountType,
            value: res.data.discount
          });
        })
        .catch((err) => {
          console.error('Error fetching products:', err);
        });
    }
  };

  // Fetch the default invoice details when the page loads
  useEffect(() => {
    fetchDefaultInvoiceData();
  }, [toDetails.leads_id]);

  // Fetch all products for selection
  useEffect(() => {
    axios
      .get(`${config.apiUrl}/product/getProductData`)
      .then((res) => {
        setAllProducts(res.data);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setSnackbarMessage('Failed to fetch products');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  }, []);

  useEffect(() => {
    if (toDetails.leads_id) {
      axios
        .get(`${config.apiUrl}/quotation/invoicelist/${toDetails.leads_id}`)
        .then((res) => {
          setInvoiceList(res.data);
        })
        .catch((err) => {
          console.error('Error fetching products:', err);
        });
    }
  }, [toDetails.leads_id]);

  const handleInvoiceChange = (event) => {
    const value = event.target.value;
    setSelectedInvoice(value);

    // If the "Clear Selection" option is selected, reset all states
    if (value === '') {
      setProducts([]);
      setInvoiceDate('');
      setInvoiceNumber('');
      setPayment_type('');
      setTransactionId('');
      setTotalWithTax('');
      setTotalWithoutTax('');
      setPaidAmount('');
      setPreviousPaidAmount('');
      setBalance('');
      setGst('');
      setIgst('');
      setDiscount({ type: '', value: '' });

      fetchDefaultInvoiceData();
    } else {
      // Handle normal invoice selection
      const selectedData = invoiceList.find((invoice) => invoice.invoice_number === value);

      if (selectedData) {
        setProducts(selectedData.product_details);
        setInvoiceDate(selectedData.invoice_date);
        setInvoiceNumber(selectedData.invoice_number);
        setPayment_type(selectedData.payment_type);
        setTransactionId(selectedData.transactionId);
        setTotalWithTax(parseFloat(selectedData.total_with_tax).toFixed(2)); // Ensure decimal formatting
        setTotalWithoutTax(parseFloat(selectedData.total_without_tax).toFixed(2));

        // Use root-level `paidAmount` and `balance` directly
        setPreviousPaidAmount(parseFloat(selectedData.paidAmount).toFixed(2)); // Store existing paid amount as decimal
        setPaidAmount(0); // Reset for new payments
        setBalance(parseFloat(selectedData.balance).toFixed(2)); // Set balance

        setGst(selectedData.gst);
        setIgst(selectedData.igst);
        setDiscount({
          type: selectedData.discountType,
          value: selectedData.discount
        });
      }
    }
  };

  const handleProductChange = (index, value) => {
    // const selectedProduct = allProducts.find((product) => product.pro_name === value);
    // const newProducts = [...products];
    // // Only update the product id and price if a new product is selected
    // if (selectedProduct) {
    //   newProducts[index].pro_id = selectedProduct.pro_id; // Set product ID
    //   newProducts[index].price = selectedProduct.price; // Set price from selected product
    // } else {
    //   // If product is removed or invalid, clear the price
    //   newProducts[index].pro_id = '';
    //   newProducts[index].price = '';
    // }
    // setProducts(newProducts);
  };

  const handleQuantityChange = (index, value) => {
    // const newProducts = [...products];
    // newProducts[index].quantity = value;
    // setProducts(newProducts);
  };

  const handlePriceChange = (index, value) => {
    // const newProducts = [...products];
    // newProducts[index].price = value;
    // setProducts(newProducts);
  };

  const calculateTotal = (paidAmount = PaidAmount) => {
    let total = products.reduce((acc, product) => {
      const total = (parseFloat(product.price) || 0) * (parseInt(product.quantity) || 0);
      return acc + total;
    }, 0);
    setSubTotal(total);
    const totalPaidAmount = (parseFloat(previousPaidAmount) || 0) + (parseFloat(paidAmount) || 0);
    const balanceAmount = totalWithTax - totalPaidAmount;
    setBalance(balanceAmount.toFixed(2)); // Ensure 2 decimal places
  };

  useEffect(() => {
    calculateTotal();
  }, [products, PaidAmount, discount, gst, igst]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmitInvoice = () => {
    if (!products.length) {
      setSnackbarMessage('Please add at least one product.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    // Validate payment type and transaction ID
    if ((payment_type === 'UPI' || payment_type === 'Banking') && !transactionId) {
      setSnackbarMessage('Transaction ID is required for UPI or Banking payments.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const totalPaidAmount = (parseFloat(previousPaidAmount) || 0) + (parseFloat(PaidAmount) || 0);

    const invoiceData = {
      invoice_number: invoiceNumber,
      leads_id: toDetails.leads_id,
      leads_name: toDetails.leads_name,
      leads_mobile: toDetails.leads_mobile,
      leads_email: toDetails.leads_email,
      product_details: products,
      total_without_tax: totalWithoutTax,
      total_with_tax: totalWithTax,
      paidAmount: totalPaidAmount,
      balance: balance,
      discount: discount.value,
      discountType: discount.type,
      payment_type: payment_type,
      transactionId: payment_type === 'Cash' ? '' : transactionId, // Transaction ID only for non-cash
      gst: gst,
      igst:igst
    };

    setLoading(true);
    axios
      .post(`${config.apiUrl}/quotation/invoices`, invoiceData)
      .then((response) => {
        if (response.status === 201) {
          const { invoice_number } = response.data;
          setSnackbarMessage(' Invoice created successfully.');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          setLoading(false);
          setSelectedInvoice(null);
          setSuccess('success');
        } else {
          const { invoice_number, invoice_date, payment_type, transactionId } = response.data;

          setInvoiceNumber(invoice_number);
          setInvoiceDate(invoice_date);
          setPayment_type(payment_type);
          setTransactionId(transactionId);
          setSnackbarMessage('Invoice created successfully.');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          setLoading(false);
          setSuccess('success');

          // Open dialog for PDF preview after successful submission
          setOpenDialog(true);
        }
      })
      .catch((error) => {
        setSnackbarMessage('Error submitting Invoice.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setLoading(false);
      });
  };
  const handleAddProduct = () => {
    setProducts([...products, { pro_id: '', quantity: '', price: '', hsn: '', description: '' }]);
  };

  const handleGstChange = (e) => {
    const value = e.target.value;
    setGst(value);

    // Check the values and update readonly state accordingly
    if (value > 0) {
      setIsGstReadOnly(false);
      setIsIgstReadOnly(true); // Set IGST to readonly if GST has a value
    } else {
      // If GST is 0, check IGST
      if (parseFloat(igst) > 0) {
        setIsIgstReadOnly(false);
      } else {
        setIsIgstReadOnly(false); // If both are 0, both are editable
      }
    }
  };

  const handleIgstChange = (e) => {
    const value = e.target.value;
    setIgst(value);

    // Check the values and update readonly state accordingly
    if (value > 0) {
      setIsIgstReadOnly(false);
      setIsGstReadOnly(true); // Set GST to readonly if IGST has a value
    } else {
      // If IGST is 0, check GST
      if (parseFloat(gst) > 0) {
        setIsGstReadOnly(false);
      } else {
        setIsGstReadOnly(false); // If both are 0, both are editable
      }
    }
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
      doc.text('Invoice', doc.internal.pageSize.width / 2, 10, { align: 'center', baseline: 'middle' });

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
      doc.save(`Invoice-${invoiceNumber}.pdf`);
    });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <Typography variant="h1" align="center" justifyContent="center" marginBottom="20px">
        Invoice
      </Typography>
      <Grid container spacing={3} alignItems="flex-start" justifyContent="space-between">
        {/* From Details */}
        <Grid item xs={6}>
          <Typography variant="h2" marginBottom={'10px'}>
            From
          </Typography>
          <Typography variant="h3">{fromDetails.company}</Typography>
          <Typography variant="h5">Phone: {fromDetails.phone}</Typography>
          <Typography variant="h5">Email: {fromDetails.email}</Typography>
          <Typography variant="h5">Address: {fromDetails.address}</Typography>
          <Typography variant="h5">GST NO: {fromDetails.gst}</Typography>
        </Grid>

        {/* To Details */}
        <Grid item xs={6} style={{ textAlign: 'left', marginLeft: '0px' }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="h2" marginBottom={'10px'}>
                To
              </Typography>
              <Typography variant="h3">{toDetails.leads_name}</Typography>
              <Typography variant="h5">Company: {toDetails.leads_company}</Typography>
              <Typography variant="h5">Phone: {toDetails.leads_mobile}</Typography>
              <Typography variant="h5">Email: {toDetails.leads_email}</Typography>
              <Typography variant="h5">GST No :{toDetails.gst_number}</Typography>
            </>
          )}
        </Grid>
      </Grid>

      {/* To Details */}
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Billing and Shipping Address */}
          <Grid container spacing={3} marginTop={'2px'}>
            <Grid item xs={12} sm={6}>
              <h3>Billing Address</h3>
              <Typography variant="h6">
                {toDetails.billing_door_number && `${toDetails.billing_door_number}, `}
                {toDetails.billing_street && `${toDetails.billing_street}, `}
                <br />
                {toDetails.billing_landMark && `${toDetails.billing_landMark}, `}
                <br />
                {toDetails.billing_city && `${toDetails.billing_city}, `}
                <br />
                {toDetails.billing_state && `${toDetails.billing_state} - `}
                {toDetails.billing_pincode || ''}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} marginBottom="10px">
              <h3>Shipping Address</h3>
              <Typography variant="h6">
                {toDetails.shipping_door_number && `${toDetails.shipping_door_number}, `}
                {toDetails.shipping_street && `${toDetails.shipping_street}, `}
                <br />
                {toDetails.shipping_landMark && `${toDetails.shipping_landMark}, `}
                <br />
                {toDetails.shipping_city && `${toDetails.shipping_city}, `}
                <br />
                {toDetails.shipping_state && `${toDetails.shipping_state} - `}
                {toDetails.shipping_pincode || ''}
              </Typography>
            </Grid>
          </Grid>

          {invoiceList.length > 0 && (
            <Grid item xs={6} sm={3} margin={'13px'}>
              <InputLabel id="invoice-select-label">Select Invoice</InputLabel>
              <Select
                labelId="invoice-select-label"
                value={selectedInvoice || ''}
                onChange={handleInvoiceChange}
                displayEmpty // Show placeholder when no value is selected
                renderValue={(selected) => {
                  return selected ? selected : <em>Select Invoice</em>; // Placeholder text
                }}
                label="Select Invoice"
              >
                <MenuItem value="">
                  <em>Clear Selection</em>
                </MenuItem>
                {invoiceList.map((invoice) => (
                  <MenuItem key={invoice.id} value={invoice.invoice_number}>
                    {invoice.invoice_number}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          )}
          {/* Product Table */}
          

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>HSN No</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, index) => {
                  const matchingProduct = allProducts.find((p) => p.pro_id === product.pro_id);
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Autocomplete
                          options={allProducts.map((product) => product.pro_name)}
                          renderInput={(params) => <TextField {...params} label="Product" />}
                          onChange={(event, value) => handleProductChange(index, value)}
                          value={matchingProduct ? matchingProduct.pro_name : ''}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          label="Quantity"
                          value={product.quantity}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                          inputProps={{ min: 0 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          label="Price"
                          value={product.price}
                          onChange={(e) => handlePriceChange(index, e.target.value)}
                          inputProps={{ min: 0 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="text"
                          label="HSN No"
                          value={product.hsn}
                          onChange={(e) => handleHsnChange(index, e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="text"
                          label="Description"
                          value={product.description}
                          onChange={(e) => handleDescriptionChange(index, e.target.value)}
                        />
                      </TableCell>
                      <TableCell>{parseFloat(product.price) * parseInt(product.quantity) || 0}</TableCell>
                      <TableCell>

                        <Button color="secondary" onClick={() => handleRemoveProduct(index)}>
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {/* Subtotal Row */}
                <TableRow>
                  <TableCell colSpan={5} align="right">
                    <Typography variant="h4">Sub Total: {subTotal}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button style={{ margin: '20px' }} onClick={handleAddProduct}>
              Add Product
            </Button>
          </TableContainer>

          {/* Discount and GST */}
          <Grid container spacing={3} margin={'2px'}>
            <Grid item xs={6} sm={3}>
              <TextField
                select
                label="Discount Type"
                value={discount.type}
                onChange={(e) => setDiscount({ ...discount, type: e.target.value })}
                fullWidth
                InputProps={{

                }}
              >
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="Amount"> Amount</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Discount"
                type="number"
                value={discount.value}
                onChange={(e) => setDiscount({ ...discount, value: e.target.value })}
                fullWidth
                InputProps={{
                }}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                label="GST"
                type="number"
                value={gst}
                onChange={handleGstChange}
                fullWidth
                InputProps={{ readOnly: isGstReadOnly }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label="IGST"
                type="number"
                value={igst}
                onChange={handleIgstChange}
                fullWidth
                InputProps={{ readOnly: isIgstReadOnly }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} margin={'2px'}>
            <Grid item xs={12} sm={2}>
              <TextField label="Total" type="number" value={totalWithTax} fullWidth inputProps={{ readOnly: true, min: 0 }} />
            </Grid>

            {previousPaidAmount > 0 && (
              <Grid item xs={12} sm={2}>
                <TextField
                  label="Advance"
                  type="number"
                  value={previousPaidAmount}
                  fullWidth
                  inputProps={{ readOnly: true, min: 0 }}
                />
              </Grid>
            )}

            <Grid item xs={6} sm={3}>
              <TextField
                label="Paid Amount"
                type="number"
                value={PaidAmount === 0 ? '' : PaidAmount}
                onChange={(e) => {
                  const newPaidAmount = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                  if (newPaidAmount > parseFloat(balance)) {
                    setPaidAmount(parseFloat(balance));
                  } else {
                    setPaidAmount(newPaidAmount);
                  }
                }}
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField label="Balance" type="number" value={balance} fullWidth inputProps={{ readOnly: true, min: 0 }} />
            </Grid>

          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="terms & conditions"
              label="Terms & Conditions"
              multiline
              rows={4}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: 'white',
                  border: 'none',
                  textAlign: 'center',
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none',
                  },
                },
              }}
              value={termsConditions}
              onChange={(e) => setTermsConditions(e.target.value)}
            />
          </Grid>
          {/* Totals */}
          <Grid item xs={6} sm={3} margin={'15px'} marginTop={'20px'}>
            <Grid container direction="column">
              <Grid item container justifyContent="space-between">
                <Typography variant="h6" style={{ flex: 0.3 }}>
                  Total (without tax)
                </Typography>
                <Typography variant="h6" style={{ textAlign: 'left', flex: 1 }}>
                  {totalWithoutTax}
                </Typography>
              </Grid>
              <Grid item container justifyContent="space-between">
                <Typography variant="h6" style={{ flex: 0.3 }}>
                  Discount
                </Typography>
                <Typography variant="h6" style={{ textAlign: 'left', flex: 1 }}>
                  {discount.type === 'percentage' ? `${discount.value}%` : `₹${discount.value}`}
                </Typography>
              </Grid>

              <Grid item container justifyContent="space-between">
                <Typography variant="h6" style={{ flex: 0.3 }}>
                  GST
                </Typography>
                <Typography variant="h6" style={{ textAlign: 'left', flex: 1 }}>
                  {gst}%
                </Typography>
              </Grid>

              <Grid item container justifyContent="space-between">
                <Typography variant="h6" style={{ flex: 0.3 }}>
                  IGST
                </Typography>
                <Typography variant="h6" style={{ textAlign: 'left', flex: 1 }}>
                  {igst}%
                </Typography>
              </Grid>

              <Grid item container justifyContent="space-between">
                <Typography variant="h6" style={{ flex: 0.3 }}>
                  Total (with tax)
                </Typography>
                <Typography variant="h6" style={{ textAlign: 'left', flex: 1 }}>
                  {totalWithTax}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={30}>
            {/* Submit Button */}
            <Button onClick={handleSubmitInvoice} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Submit Invoice'}
            </Button>
            <Button onClick={() => setOpenDialog(true)} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Preview'}
            </Button>
          </Grid>

          {/* PDF Preview Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle>Invoice Preview</DialogTitle>
            <DialogContent dividers color="red">
              <div
                ref={pdfRef}
                style={{
                  padding: '10px',
                  backgroundColor: '#ffffff',
                  backgroundImage: '', // Optional background image
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  // border: '2px solid #ddd',
                  // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
                    <Typography variant="h6">Invoice No: {invoiceNumber}</Typography>
                    <Typography variant="h6">Date: {formattedDate}</Typography> {/* Using formattedDate for dd/mm/yyyy format */}
                    <Typography variant="h6">Payment Type: {payment_type}</Typography>
                    {/* Conditionally render the Transaction ID if payment_type is not 'Cash' */}
                    {payment_type !== 'Cash' && <Typography variant="h6">Transaction Id: {transactionId}</Typography>}
                  </Grid>
                </Grid>
                {/* Company Logo */}
                <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                  {/* From Section */}
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
                    <Typography variant="h3">{toDetails.leads_name}</Typography>
                    <Typography variant="h5">Company: {toDetails.leads_company}</Typography>
                    <Typography variant="h6">Phone: {toDetails.leads_mobile}</Typography>
                    <Typography variant="h6">Email: {toDetails.leads_email}</Typography>
                    <Typography variant="h6">GST No :{toDetails.gst_number}</Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={3} style={{ borderWidth: '2px', borderColor: 'black', paddingTop: '15px' }}>
                  {/* Billing Address */}

                  <Grid item xs={6}>
                    <Typography variant="h4">Billing Address</Typography>
                    <Typography variant="h6">
                      {toDetails.billing_door_number || 'N/A'},<br /> {toDetails.billing_street || 'N/A'},{' '}
                      {toDetails.billing_landMark || 'N/A'}, <br />
                      {toDetails.billing_city || 'N/A'},<br /> {toDetails.billing_state || 'N/A'} - {toDetails.billing_pincode || 'N/A'}
                    </Typography>
                  </Grid>

                  {/* Shipping Address */}
                  <Grid item xs={6}>
                    <Typography variant="h4">Shipping Address</Typography>

                    <Typography variant="h6">
                      {toDetails.billing_door_number || 'N/A'}, <br />
                      {toDetails.billing_street || 'N/A'}, {toDetails.billing_landMark || 'N/A'}, <br />
                      {toDetails.billing_city || 'N/A'}, <br />
                      {toDetails.billing_state || 'N/A'} - {toDetails.billing_pincode || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
                {/* Quotation Title and Details */}
                {/* Product Details Table */}
                <TableContainer style={{ marginTop: '20px' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product, index) => {
                        // Find the matching product by pro_id
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
                    <TableCell colSpan={4} align="right">
                      <Typography variant="h4">Sub Total: {subTotal}</Typography>
                    </TableCell>
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
                        {totalWithoutTax}
                      </Typography>
                    </Grid>
                    <Grid item container justifyContent="space-between">
                      <Typography variant="h6" style={{ textAlign: 'right', flex: 1 }}>
                        Discount
                      </Typography>
                      <Typography variant="h6" style={{ textAlign: 'right', flex: 0.1 }}>
                        {discount.type === 'percentage' ? `${discount.value}%` : `₹${discount.value}`}
                      </Typography>
                    </Grid>
                    <Grid item container justifyContent="space-between">
                      <Typography variant="h6" style={{ textAlign: 'right', flex: 1 }}>
                        GST
                      </Typography>
                      <Typography variant="h6" style={{ textAlign: 'right', flex: 0.1 }}>
                        {gst}%
                      </Typography>
                    </Grid>
                    <Grid item container justifyContent="space-between">
                      <Typography variant="h4" style={{ textAlign: 'right', flex: 1 }}>
                        Total (with tax)
                      </Typography>
                      <Typography variant="h4" style={{ textAlign: 'right', flex: 0.1 }}>
                        {totalWithTax}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </DialogContent>

            {/* Actions for Download */}
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button onClick={handleGeneratePDF}>Download PDF</Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for feedback */}
          <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </>
      )}
    </div>
  );
};

export default InvoicePage;
