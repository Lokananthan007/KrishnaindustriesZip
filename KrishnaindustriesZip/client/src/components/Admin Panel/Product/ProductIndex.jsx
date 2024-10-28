import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination
} from '@mui/material';
import axios from 'axios';
import JsBarcode from 'jsbarcode';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';
import AddProduct from './AddProduct';
import UpdateProduct from './UpdateProduct';
import Search from '../../Search Option/Search';
import config from '../../../config';
import './ProductIndex.css'; 

const ProductIndex = () => {
  const [productData, setProductData] = useState([]);
  const [searchProductData, setSearchProductData] = useState([]);
  const [updateData, setUpdateData] = useState();
  const [dltData, setDltData] = useState();
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [openNew, setOpenNew] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDlt, setOpenDlt] = useState(false);
  const [openScanner, setOpenScanner] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);
  const barcodeRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductData();
  }, [openNew, openUpdate, openDlt]);

  const fetchProductData = () => {
    axios
      .get(`${config.apiUrl}/product/getProductData`)
      .then((res) => {
        setProductData(res.data);
        setSearchProductData(res.data);
      })
      .catch(() => {
        console.log('Product Data is not fetched.');
      });
  };

  useEffect(() => {
    barcodeRefs.current = barcodeRefs.current.slice(0, productData.length);
    productData.forEach((product, index) => {
      if (barcodeRefs.current[index]) {
        JsBarcode(barcodeRefs.current[index], product.pro_id, {
          format: 'CODE128',
          displayValue: true
        });
      }
    });
  }, [productData, currentPage, dataPerPage]);

  const handleUpdate = (id) => {
    const selectUpdate = productData.find((pro) => pro.pro_id === id);
    if (selectUpdate) {
      setUpdateData(selectUpdate);
      setOpenUpdate(true);
    }
  };

  const handleDlt = (id) => {
    if (id) {
      setDltData(id);
      setOpenDlt(true);
    }
  };

  const confirmDlt = () => {
    if (dltData) {
      axios
        .delete(`${config.apiUrl}/product/delete/${dltData}`)
        .then(() => {
          setOpenDlt(false);
          fetchProductData();
        })
        .catch((err) => {
          console.log('Product Data is not deleted.', err);
        });
    }
  };

  const handleChangeDataPerPage = (e) => {
    const newDataPerPage = parseInt(e.target.value, 10);
    if (newDataPerPage === 1) {
      setDataPerPage(productData.length);
      setCurrentPage(1);
    } else {
      setDataPerPage(newDataPerPage);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const firstIndexOfData = (currentPage - 1) * dataPerPage;
  const lastIndexOfData = currentPage * dataPerPage;
  const currentData = searchProductData.slice(firstIndexOfData, lastIndexOfData);

  const totalPages = Math.ceil(searchProductData.length / dataPerPage);

  const handleScan = (data) => {
    if (data) {
      // Assuming that the QR code contains an ID to fetch product details
      const productId = data; // Adjust based on your QR code content

      if (productId) {
        axios
          .get(`${config.apiUrl}/product/${productId}`)
          .then((res) => {
            setScannedProduct(res.data);
            setOpenScanner(false);
          })
          .catch((err) => {
            console.error('Error fetching product by QR code', err);
          });
      }
    }
  };

  const handleError = (err) => {
    console.error('QR Scan Error: ', err);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <h1 className="text-center">Product Index</h1>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Button onClick={() => setOpenNew(true)}>Add New</Button>
        </Grid>
        <Grid item xs={4}>
          <Search data={productData} setData={setSearchProductData} />
        </Grid>
        <Grid item xs={4}>
          <FormControl>
            <Select value={dataPerPage} onChange={handleChangeDataPerPage}>
              <MenuItem value={5}>5 Per Page</MenuItem>
              <MenuItem value={10}>10 Per Page</MenuItem>
              <MenuItem value={15}>15 Per Page</MenuItem>
              <MenuItem value={1}>All Per Page</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {/* <Button onClick={() => setOpenScanner(true)}>Scan QR Code</Button> */}
      <TableContainer component={Paper} className="mt-5">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }} className="no-print">
                S.No
              </TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell style={{ fontWeight: 'bold' }} className="no-print">
                Product Image
              </TableCell>
              <TableCell className="no-print">Product Description</TableCell>
              <TableCell style={{ fontWeight: 'bold' }} className="no-print">
                Specification
              </TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Barcode</TableCell>
              <TableCell style={{ fontWeight: 'bold' }} className="no-print">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((pro, index) => (
              <TableRow key={index}>
                <TableCell className="no-print">{firstIndexOfData + index + 1}</TableCell>
                <TableCell>{pro.pro_name}</TableCell>
                <TableCell className="no-print">
                  <img src={`${config.apiUrl}/uploads/${pro.pro_img}`} alt={pro.pro_name} height="100" width="100" />
                </TableCell>
                <TableCell className="no-print">{pro.description}</TableCell>
                <TableCell className="no-print">
                  <Button onClick={() => navigate(`/specIndex/${pro.pro_id}`)}>Specification Index</Button>
                </TableCell>
                <TableCell>
                  <svg ref={(el) => (barcodeRefs.current[firstIndexOfData + index] = el)}></svg>
                </TableCell>
                <TableCell className="no-print">
                  <Button onClick={() => handleUpdate(pro.pro_id)}>Edit</Button>
                  <Button onClick={() => handleDlt(pro.pro_id)}>Delete</Button>
                  <Button onClick={handlePrint}>Print</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
      </div>

      <Dialog open={openNew} onClose={() => setOpenNew(false)} maxWidth="md">
        <DialogContent>
          <AddProduct onClose={() => setOpenNew(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNew(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} maxWidth="md">
        <DialogContent>
          <UpdateProduct data={updateData} onClose={() => setOpenUpdate(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdate(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDlt} onClose={() => setOpenDlt(false)} maxWidth="md">
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this product?</p>
        </DialogContent>
        <DialogActions>
          <Button style={{ backgroundColor: 'red', color: 'white' }} onClick={confirmDlt}>
            Delete
          </Button>
          <Button onClick={() => setOpenDlt(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openScanner} onClose={() => setOpenScanner(false)} maxWidth="md">
        <DialogContent>
          <QrReader
            onResult={(result, error) => {
              if (!!result) {
                handleScan(result?.text);
              }
              if (!!error) {
                handleError(error);
              }
            }}
            constraints={{ facingMode: 'environment' }}
          />
          {scannedProduct && (
            <div>
              <h2>Scanned Product Details</h2>
              <p>Product Name: {scannedProduct.pro_name}</p>
              <p>Description: {scannedProduct.description}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenScanner(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductIndex;
