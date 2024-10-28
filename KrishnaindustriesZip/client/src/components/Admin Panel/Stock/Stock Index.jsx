import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  TableSortLabel,
  Box,
  IconButton,
  Snackbar
} from '@mui/material';
import axios from 'axios';
import config from '../../../config';
import CloseIcon from '@mui/icons-material/Close';

const ProductStockTable = () => {
  const [productStocks, setProductStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchProductStocks = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/product/product-stocks`);
        setProductStocks(response.data);
      } catch (err) {
        setError('Error fetching product stocks');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProductStocks();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h1" marginTop={'13px'} gutterBottom align="center">
        Product Stock Overview
      </Typography>
      {error && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={error}
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      )}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel>Product ID</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Product Name</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Total Purchased</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Total Sold</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Available Stock</TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productStocks.map((product) => (
              <TableRow key={product.productId} hover>
                <TableCell>{product.productId}</TableCell>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.totalPurchased}</TableCell>
                <TableCell>{product.totalSold}</TableCell>
                <TableCell>{product.availableStock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductStockTable;
