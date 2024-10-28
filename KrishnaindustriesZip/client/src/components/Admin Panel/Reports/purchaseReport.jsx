import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Pagination
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

import config from '../../../config'; // Assuming you have the API URL configured here

const PurchaseReport = () => {
  const [purchases, setPurchases] = useState([]); // Purchase history from the backend
  const [open, setOpen] = useState(false); // Dialog open state for new purchase entry
  const [allProducts, setAllProducts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Snackbar severity
  const [formData, setFormData] = useState({
    productName: '',
    productId: '',
    specification: '',
    quantity: '',
    price: '',
    gst: '',
    cgst: '',
    sgst: '',
    totalPrice: '', // Total price without GST
    totalPriceWithGST: '', // Total price including GST
    fromName: '',
    address: '',
    street: '',
    city: '',
    state: '',
    pinCode: ''
  });

  const [searchTerm, setSearchTerm] = useState(''); // Search term
  const [monthFilter, setMonthFilter] = useState(''); // Month filter
  const [yearFilter, setYearFilter] = useState(''); // Year filter
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

  // Fetch purchase history from the backend
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/purchase/purchases`);
        setPurchases(response.data);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      }
    };
    fetchPurchases();
  }, []);

  useEffect(() => {
    axios
      .get(`${config.apiUrl}/product/getProductData`) // Adjust endpoint as needed
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

  // Open the dialog to enter a new purchase
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close the dialog
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      productName: '',
      productId: '',
      specification: '',
      quantity: '',
      price: '',
      gst: '',
      cgst: '',
      sgst: '',
      totalPrice: '',
      totalPriceWithGST: '',
      fromName: '',
      address: '',
      street: '',
      city: '',
      state: '',
      pinCode: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Calculate CGST, SGST, Total Price without GST and Total Price with GST
    if (name === 'gst') {
      const gstValue = parseFloat(value) || 0;
      const quantity = parseFloat(formData.quantity) || 0;
      const price = parseFloat(formData.price) || 0;

      const totalPrice = (quantity * price).toFixed(2);
      const totalGST = (totalPrice * (gstValue / 100)).toFixed(2);

      // Calculate SGST and CGST
      const cgst = (totalGST / 2).toFixed(2);
      const sgst = cgst; // SGST is equal to CGST

      setFormData((prev) => ({
        ...prev,
        gst: value,
        cgst,
        sgst,
        totalPrice,
        totalPriceWithGST: (parseFloat(totalPrice) + parseFloat(totalGST)).toFixed(2)
      }));
    }

    if (name === 'quantity' || name === 'price') {
      const quantity = parseFloat(formData.quantity) || 0;
      const price = parseFloat(formData.price) || 0;
      const totalPrice = (quantity * price).toFixed(2);

      const gstValue = parseFloat(formData.gst) || 0;
      const totalGST = (totalPrice * (gstValue / 100)).toFixed(2);

      const cgst = (totalGST / 2).toFixed(2);
      const sgst = cgst; // SGST is equal to CGST

      setFormData((prev) => ({
        ...prev,
        totalPrice,
        cgst,
        sgst,
        totalPriceWithGST: (parseFloat(totalPrice) + parseFloat(totalGST)).toFixed(2)
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      // Make the POST request to the backend with the purchase data
      await axios.post(`${config.apiUrl}/purchase/purchases`, formData);
      // Refresh purchase history after successful submission
      const response = await axios.get(`${config.apiUrl}/purchase/purchases`);
      setPurchases(response.data);
      setSnackbarMessage('Purchase added successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleClose();
    } catch (error) {
      console.error('Error submitting purchase data:', error);
      setSnackbarMessage('Error adding purchase. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Close Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle month filter change
  const handleMonthFilterChange = (e) => {
    setMonthFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle year filter change
  const handleYearFilterChange = (e) => {
    setYearFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Get filtered and paginated purchases
  const getFilteredPurchases = () => {
    return purchases.filter((purchase) => {
      const matchesSearch = purchase.productName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMonth = monthFilter ? new Date(purchase.date).getMonth() + 1 === parseInt(monthFilter) : true;
      const matchesYear = yearFilter ? new Date(purchase.date).getFullYear() === parseInt(yearFilter) : true;
      return matchesSearch && matchesMonth && matchesYear;
    });
  };

  // Handle pagination change
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(getFilteredPurchases().length / rowsPerPage);
  const displayedPurchases = getFilteredPurchases().slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <>
      {/* Search and Filter Section */}
      <Typography variant="h1" align="center" marginTop={'20px'} gutterBottom>
        Purchase History
      </Typography>

      <Grid container spacing={2} style={{ marginBottom: '20px' }}>
        <Grid item xs={12} sm={6}>
          <TextField label="Search" variant="outlined" value={searchTerm} onChange={handleSearchChange} fullWidth />
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Month</InputLabel>
            <Select value={monthFilter} onChange={handleMonthFilterChange} label="Month">
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {[...Array(12).keys()].map((month) => (
                <MenuItem key={month + 1} value={month + 1}>
                  {month + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Year</InputLabel>
            <Select value={yearFilter} onChange={handleYearFilterChange} label="Year">
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {[2020, 2021, 2022, 2023, 2024].map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Specification</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price Per Piece</TableCell>
              <TableCell>CGST</TableCell>
              <TableCell>SGST</TableCell>
              <TableCell>Total GST</TableCell>
              <TableCell>Total Price (Without GST)</TableCell>
              <TableCell>Total Price (With GST)</TableCell>
              <TableCell>From</TableCell>
              <TableCell>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPurchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>{purchase.productName}</TableCell>
                <TableCell>{purchase.specification}</TableCell>
                <TableCell>{purchase.quantity}</TableCell>
                <TableCell>{purchase.price}</TableCell>
                <TableCell>{purchase.cgst}</TableCell>
                <TableCell>{purchase.sgst}</TableCell>
                <TableCell>{(parseFloat(purchase.cgst) + parseFloat(purchase.sgst)).toFixed(2)}</TableCell>
                <TableCell>{purchase.totalPrice}</TableCell>
                <TableCell>{purchase.totalPriceWithGST}</TableCell>
                <TableCell>{purchase.fromName}</TableCell>
                <TableCell>
                  {purchase.address}, {purchase.street}, {purchase.city}, {purchase.state}, {purchase.pinCode}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
      />

      {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PurchaseReport;
