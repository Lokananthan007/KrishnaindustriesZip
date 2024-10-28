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
  Pagination,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Autocomplete from '@mui/material/Autocomplete';
import ExcelUpload from './UploadExell';
import config from '../../../config';

const PurchaseIndex = () => {
  const [purchases, setPurchases] = useState([]); // Purchase history from the backend
  const [open, setOpen] = useState(false); // Dialog open state for new/edit purchase entry
  const [allProducts, setAllProducts] = useState([]);
  const [editMode, setEditMode] = useState(false); // To track if we're editing or adding a purchase
  const [editPurchaseId, setEditPurchaseId] = useState(null); // To store the ID of the purchase being edited
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Snackbar severity
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Confirmation dialog state
  const [purchaseIdToDelete, setPurchaseIdToDelete] = useState(null); // ID of the purchase to delete
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
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/purchase/purchases`);
      setPurchases(response.data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

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
    setEditMode(false); // Reset edit mode when adding new purchase
  };

  // Open the dialog to edit a purchase
  const handleEditClick = (purchase) => {
    setFormData({
      productName: purchase.productName,
      productId: purchase.productId,
      specification: purchase.specification,
      quantity: purchase.quantity,
      price: purchase.price,
      gst: purchase.gst,
      cgst: purchase.cgst,
      sgst: purchase.sgst,
      totalPrice: purchase.totalPrice,
      totalPriceWithGST: purchase.totalPriceWithGST,
      fromName: purchase.fromName,
      address: purchase.address,
      street: purchase.street,
      city: purchase.city,
      state: purchase.state,
      pinCode: purchase.pinCode
    });
    setEditMode(true);
    setEditPurchaseId(purchase.id);
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
    if (name === 'gst' || name === 'quantity' || name === 'price') {
      const gstValue = parseFloat(formData.gst) || 0;
      const quantity = parseFloat(formData.quantity) || 0;
      const price = parseFloat(formData.price) || 0;
      const totalPrice = (quantity * price).toFixed(2);
      const totalGST = (totalPrice * (gstValue / 100)).toFixed(2);
      const cgst = (totalGST / 2).toFixed(2);
      const sgst = cgst;

      setFormData((prev) => ({
        ...prev,
        gst: gstValue,
        cgst,
        sgst,
        totalPrice,
        totalPriceWithGST: (parseFloat(totalPrice) + parseFloat(totalGST)).toFixed(2)
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        // Update an existing purchase
        await axios.put(`${config.apiUrl}/purchase/purchases/${editPurchaseId}`, formData);
        setSnackbarMessage('Purchase updated successfully!');
      } else {
        // Make the POST request to the backend with the purchase data
        await axios.post(`${config.apiUrl}/purchase/purchases`, formData);
        setSnackbarMessage('Purchase added successfully!');
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchPurchases(); // Refresh purchase history
      handleClose();
    } catch (error) {
      console.error('Error submitting purchase data:', error);
      setSnackbarMessage('Error adding/updating purchase. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Open the delete confirmation dialog
  const openDeleteDialog = (purchaseId) => {
    setPurchaseIdToDelete(purchaseId); // Store the purchase ID to delete
    setDeleteDialogOpen(true);
  };

  // Close the delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPurchaseIdToDelete(null); // Reset the ID to delete
  };

  // Handle delete purchase
  const handleDelete = async () => {
    try {
      await axios.delete(`${config.apiUrl}/purchase/purchases/${purchaseIdToDelete}`);
      setSnackbarMessage('Purchase deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchPurchases(); // Refresh the purchase list
      closeDeleteDialog(); // Close the delete dialog
    } catch (error) {
      console.error('Error deleting purchase:', error);
      setSnackbarMessage('Error deleting purchase. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      closeDeleteDialog(); // Close the delete dialog even on error
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
    setCurrentPage(1);
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
      const matchesMonth = monthFilter ? new Date(purchase.created_at).getMonth() + 1 === parseInt(monthFilter) : true;
      const matchesYear = yearFilter ? new Date(purchase.created_at).getFullYear() === parseInt(yearFilter) : true;
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
      <Typography variant="h1" align="center" marginTop={'13px'} gutterBottom>
        Purchase Index
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

      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        New Purchase
      </Button>
      <ExcelUpload />

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
              <TableCell>Actions</TableCell> {/* Add actions column */}
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
                <TableCell>{`${purchase.address}, ${purchase.street}, ${purchase.city}, ${purchase.state}, ${purchase.pinCode}`}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(purchase)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => openDeleteDialog(purchase.id)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
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

      {/* New/Edit Purchase Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Purchase' : 'New Purchase'}</DialogTitle>
        <DialogContent>
          {/* Form Fields */}
          <Autocomplete
            options={allProducts}
            getOptionLabel={(product) => product.pro_name} // Use this to display the product name
            renderInput={(params) => <TextField {...params} label="Product Name" variant="outlined" />}
            onChange={(event, value) => {
              if (value) {
                setFormData((prev) => ({
                  ...prev,
                  productName: value.pro_name,
                  productId: value.pro_id // Assuming 'pro_id' is the product id field
                }));
              } else {
                setFormData((prev) => ({
                  ...prev,
                  productName: '',
                  productId: '' // Reset if no product is selected
                }));
              }
            }}
            value={allProducts.find((product) => product.pro_name === formData.productName) || null}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Specification"
            name="specification"
            value={formData.specification}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price Per Piece"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField label="GST (%)" name="gst" value={formData.gst} onChange={handleInputChange} type="number" fullWidth margin="normal" />
          <TextField label="CGST" name="cgst" value={formData.cgst} onChange={handleInputChange} type="number" fullWidth margin="normal" />
          <TextField label="SGST" name="sgst" value={formData.sgst} onChange={handleInputChange} type="number" fullWidth margin="normal" />
          <TextField label="Total Price Without GST" name="totalPrice" value={formData.totalPrice} readOnly fullWidth margin="normal" />
          <TextField
            label="Total Price With GST"
            name="totalPriceWithGST"
            value={formData.totalPriceWithGST}
            readOnly
            fullWidth
            margin="normal"
          />
          <TextField label="From Name" name="fromName" value={formData.fromName} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Address" name="address" value={formData.address} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Street" name="street" value={formData.street} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="City" name="city" value={formData.city} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="State" name="state" value={formData.state} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Pin Code" name="pinCode" value={formData.pinCode} onChange={handleInputChange} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editMode ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this purchase?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PurchaseIndex;
