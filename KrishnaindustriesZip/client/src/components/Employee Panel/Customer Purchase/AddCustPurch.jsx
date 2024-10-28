import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Grid,
  MenuItem,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';
import moment from 'moment';
import logo from '../../../images/Krishna Industries2.jpeg';

const AddCustPurch = ({ cust_id, onClose }) => {
  const [proData, setProData] = useState([]);
  const [custData, setCustData] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cust_id: cust_id ? cust_id : '',
    payment_type: '',
    payment_amount: '',
    balance: '',
    total: '',
    dispatchdate: ''
  });
  const [currentProduct, setCurrentProduct] = useState({
    pro_id: '',
    quantity: '',
    price: ''
  });
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [showQuotation, setShowQuotation] = useState(false);
  const [quotationNumber, setQuotationNumber] = useState('');

  useEffect(() => {
    axios
      .get(`${config.apiUrl}/product/getProductData`)
      .then((res) => {
        setProData(res.data);
      })
      .catch((err) => {
        console.log('Product data is not fetched.');
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${config.apiUrl}/customer/getCustomerByEmpId/${sessionStorage.getItem('emp_id')}`)
      .then((res) => {
        setCustData(res.data);
      })
      .catch((err) => {
        console.log('Customer data is not fetched.');
      });
  }, []);

  useEffect(() => {
    setQuotationNumber(generateQuotationNumber());
  }, []);

  const generateQuotationNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleValidation = (name, value) => {
    let errmsg = '';
    const trimmedValue = value && typeof value === 'string' ? value.trim() : value;
    switch (name) {
      case 'pro_id':
        if (!trimmedValue) errmsg = 'Product name is required.';
        break;
      case 'quantity':
        if (!trimmedValue) errmsg = 'Quantity is required.';
        break;
      case 'price':
        if (!trimmedValue) errmsg = 'Price is required.';
        break;
      case 'payment_type':
        if (!trimmedValue) errmsg = 'Payment type is required.';
        break;
      case 'payment_amount':
        if (!trimmedValue) errmsg = 'Payment amount is required.';
        break;
      case 'balance':
        if (!trimmedValue) errmsg = 'Balance amount is required.';
        break;
      case 'total':
        if (!trimmedValue) errmsg = 'Total amount is required.';
        break;
      default:
        break;
    }
    return errmsg;
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    if (name === 'payment_type' && value === 'partial') {
      const total = parseFloat(updatedFormData.total || 0);
      const payment_amount = parseFloat(updatedFormData.payment_amount || 0);
      updatedFormData.balance = (total - payment_amount).toFixed(2);
    } else if (name === 'payment_amount') {
      const total = parseFloat(updatedFormData.total || 0);
      const payment_amount = parseFloat(value || 0);
      updatedFormData.balance = (total - payment_amount).toFixed(2);
    } else if (name === 'quantity' || name === 'price') {
      const quantity = parseFloat(updatedFormData.quantity || 0);
      const price = parseFloat(updatedFormData.price || 0);
      updatedFormData.total = (quantity * price).toFixed(2);
    }

    const error = handleValidation(name, value);

    setFormData(updatedFormData);
    setErrors({ ...errors, [name]: error });
  };

  const handleAddProduct = () => {
    let productErr = {};
    Object.keys(currentProduct).forEach((name) => {
      const value = currentProduct[name];
      const error = handleValidation(name, value);
      if (error) productErr[name] = error;
    });

    if (Object.keys(productErr).length > 0) {
      setErrors(productErr);
      return;
    }

    setProducts([...products, currentProduct]);
    setCurrentProduct({
      pro_id: '',
      quantity: '',
      price: ''
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (products.length === 0) {
      alert('Please add at least one product.');
      return;
    }

    const total = products.reduce((acc, product) => acc + parseFloat(product.price) * parseFloat(product.quantity), 0);
    const payment_amount = parseFloat(formData.payment_amount || 0);
    const balance = (total - payment_amount).toFixed(2);

    const proIds = products.map((product) => product.pro_id);
    const quantities = products.map((product) => product.quantity);
    const prices = products.map((product) => product.price);

    const formDataToSubmit = {
      ...formData,
      pro_id: proIds,
      quantity: quantities,
      price: prices,
      total: total.toFixed(2),
      balance
    };

    try {
      await axios.post(`${config.apiUrl}/cust_purch/addCustPurch`, formDataToSubmit);
      setShowQuotation(true); // Show the quotation dialog
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit the form.');
    }
  };

  const handleSendEmail = async () => {
    const emailData = {
      to: customer.cust_email,
      subject: 'Invoice',
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                <!-- Header Section -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #004d40; padding-bottom: 10px;">
                    <img src="https://krishnaindustries.bewelldentalandaestheticcare.in/assets/Krishna%20Industries-d-0GPqQG.jpeg" alt="Company Logo" width="75px" height="50px" />
                    <div style="text-align: center;">
                        <h4 style="font-weight: bold; color: #004d40; margin: 0;">Quotation</h4>
                        <h6>Date: ${moment().format('YYYY-MM-DD')}</h6>
                        <h6>Invoice No: ${quotationNumber}</h6>
                    </div>
                </div>
                <!-- Client and Company Info -->
                <div style="margin-top: 20px; display: flex; justify-content: space-between;">
                    <div style="border-right: 2px solid #004d40; padding-right: 20px;">
                        <h6 style="font-weight: bold; color: #004d40;">From:</h6>
                        <p>Krishna Industries</p>
                        <p>Peelamedu, Singanallur</p>
                        <p>Coimbatore, 627757</p>
                        <p>Phone: +91-1234567890</p>
                        <p>Email: <span style="color: #004d40;">info@krishnaindustries.com</span></p>
                    </div>
                    <div style="padding-left: 20px;">
                        <h6 style="font-weight: bold; color: #004d40;">To:</h6>
                        <p>${customer.cust_name}</p>
                        <p>Phone: ${customer.cust_phone}</p>
                        <p>Email: ${customer.cust_email}</p>
                    </div>
                </div>
                <!-- Itemized Table -->
                <div style="margin-top: 20px; border: 1px solid #004d40; border-radius: 4px; overflow: hidden; background-color: #ffffff;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #004d40; color: #ffffff;">
                                <th style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">S.No</th>
                                <th style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Product Name</th>
                                <th style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Description</th>
                                <th style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Quantity</th>
                                <th style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Price</th>
                                <th style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${products
                              .map(
                                (product, index) => `
                                <tr key=${index}>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${index + 1}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${proData.find((pro) => pro.pro_id === product.pro_id)?.pro_name}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${proData.find((pro) => pro.pro_id === product.pro_id)?.description}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${product.quantity}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${parseFloat(product.price).toFixed(2)}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${(parseFloat(product.price) * parseFloat(product.quantity)).toFixed(2)}</td>
                                </tr>
                            `
                              )
                              .join('')}
                        </tbody>
                    </table>
                </div>
                <!-- Summary and Footer -->
                <div style="margin-top: 20px; text-align: right; border-top: 2px solid #004d40; padding-top: 10px;">
                    <h6 style="color: #004d40;"><span style="font-weight: bold;">Subtotal:</span> ${total.toFixed(2)}</h6>
                    <h6 style="color: #004d40;"><span style="font-weight: bold;">CGST 9%:</span> ${cgst}</h6>
                    <h6 style="color: #004d40;"><span style="font-weight: bold;">SGST 9%:</span> ${sgst}</h6>
                    <h6 style="color: #004d40;"><span style="font-weight: bold;">Total Amount:</span> ${totalWithTax}</h6>
                </div>
                <!-- Payment Terms -->
                <div style="margin-top: 20px; border-top: 2px solid #004d40; padding-top: 10px;">
                    <h6 style="margin-top: 20px; text-align: center; font-style: italic; color: #004d40;">Thank you for your business!</h6>
                </div>
            </div>
        `
    };

    try {
      await axios.post(`${config.apiUrl}/send-email`, emailData);
      alert('Email sent successfully');
      handleCloseQuotation();
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email');
    }
  };

  const handleCloseQuotation = () => {
    setShowQuotation(false);
    onClose();
    navigate('/CustPurchIndex');
  };

  const customer = custData.find((cust) => cust.cust_id === formData.cust_id) || {};
  const price = parseFloat(currentProduct.price || 0);
  const quantity = parseFloat(currentProduct.quantity || 0);
  const total = products.reduce((acc, product) => acc + parseFloat(product.price) * parseFloat(product.quantity), 0);
  const cgst = (total * 0.09).toFixed(2);
  const sgst = (total * 0.09).toFixed(2);
  const totalWithTax = (total + parseFloat(cgst) + parseFloat(sgst)).toFixed(2);

  return (
    <div>
      <h1 className="text-center">Purchase Form</h1>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {cust_id ? (
            <TextField
              select
              fullWidth
              name="cust_id"
              label="Select customer"
              onChange={handleChangeInput}
              value={formData.cust_id}
              disabled
            >
              {custData.map((cust) => (
                <MenuItem key={cust.cust_id} value={cust.cust_id}>
                  {cust.cust_name}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              select
              fullWidth
              name="cust_id"
              label="Select customer"
              onChange={handleChangeInput}
              value={formData.cust_id}
              error={!!errors.cust_id}
              helperText={errors.cust_id}
            >
              {custData.map((cust) => (
                <MenuItem key={cust.cust_id} value={cust.cust_id}>
                  {cust.cust_name}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Grid>
        <Grid item xs={6}>
          <TextField
            select
            fullWidth
            name="pro_id"
            label="Select Product Name"
            onChange={(e) => setCurrentProduct({ ...currentProduct, pro_id: e.target.value })}
            value={currentProduct.pro_id}
            error={!!errors.pro_id}
            helperText={errors.pro_id}
          >
            {proData.map((pro) => (
              <MenuItem key={pro.pro_id} value={pro.pro_id}>
                {pro.pro_name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="quantity"
            label="Quantity"
            type="number"
            onChange={(e) => setCurrentProduct({ ...currentProduct, quantity: e.target.value })}
            value={currentProduct.quantity}
            error={!!errors.quantity}
            helperText={errors.quantity}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="price"
            label="Price"
            type="number"
            onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
            value={currentProduct.price}
            error={!!errors.price}
            helperText={errors.price}
          />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="center">
          <Button onClick={handleAddProduct}>Add Product</Button>
        </Grid>
        {products.length > 0 && (
          <Grid item xs={12}>
            <TableContainer
              style={{
                marginTop: '20px',
                border: '1px solid #004d40',
                borderRadius: '4px',
                overflow: 'hidden',
                backgroundColor: '#ffffff'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', backgroundColor: '#004d40', color: '#ffffff' }}>
                      S.No
                    </TableCell>
                    <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', backgroundColor: '#004d40', color: '#ffffff' }}>
                      Product Name
                    </TableCell>
                    <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', backgroundColor: '#004d40', color: '#ffffff' }}>
                      Quantity
                    </TableCell>
                    <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', backgroundColor: '#004d40', color: '#ffffff' }}>
                      Price
                    </TableCell>
                    <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', backgroundColor: '#004d40', color: '#ffffff' }}>
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ border: '1px solid #ddd' }}>{index + 1}</TableCell>
                      <TableCell style={{ border: '1px solid #ddd' }}>
                        {proData.find((pro) => pro.pro_id === product.pro_id)?.pro_name}
                      </TableCell>
                      <TableCell style={{ border: '1px solid #ddd' }}>{product.quantity}</TableCell>
                      <TableCell style={{ border: '1px solid #ddd' }}>{parseFloat(product.price).toFixed(2)}</TableCell>
                      <TableCell style={{ border: '1px solid #ddd' }}>
                        {(parseFloat(product.price) * parseFloat(product.quantity)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
        <Grid item xs={6}>
          <TextField
            select
            fullWidth
            name="payment_type"
            label="Select Payment type"
            onChange={handleChangeInput}
            value={formData.payment_type}
            error={!!errors.payment_type}
            helperText={errors.payment_type}
          >
            <MenuItem value="full">Full Payment</MenuItem>
            <MenuItem value="partial">Partial Payment</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth name="total" label="Total" type="number" onChange={handleChangeInput} value={total} disabled />
        </Grid>
        {formData.payment_type === 'partial' && (
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="payment_amount"
              label="Advance Amount"
              type="number"
              onChange={handleChangeInput}
              value={formData.payment_amount}
              error={!!errors.payment_amount}
              helperText={errors.payment_amount}
            />
          </Grid>
        )}
        {formData.payment_type === 'full' && (
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="payment_amount"
              label="Payment Amount"
              type="number"
              onChange={handleChangeInput}
              value={formData.payment_amount}
              error={!!errors.payment_amount}
              helperText={errors.payment_amount}
            />
          </Grid>
        )}
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="balance"
            label="Balance Amount"
            type="number"
            onChange={handleChangeInput}
            value={formData.balance}
            error={!!errors.balance}
            helperText={errors.balance}
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="dispatchdate"
            label="Dispatch Date"
            type="date"
            onChange={handleChangeInput}
            value={formData.dispatchdate}
            error={!!errors.dispatchdate}
            helperText={errors.dispatchdate}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="center">
          <Button onClick={handleSubmit}>Submit</Button>
        </Grid>
      </Grid>
      <Dialog open={showQuotation} onClose={onClose} maxWidth="lg">
        <DialogContent>
          <div
            style={{
              fontFamily: 'Arial, sans-serif',
              maxWidth: '800px',
              margin: 'auto',
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}
          >
            {/* Header Section */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '3px solid #004d40',
                paddingBottom: '10px'
              }}
            >
              <img src={logo} alt="Company Logo" width="150" height="auto" />
              <div style={{ textAlign: 'center' }}>
                <Typography variant="h4" style={{ fontWeight: 'bold', color: '#004d40' }}>
                  Invoice
                </Typography>
                <Typography variant="h6">Invoice No: {quotationNumber}</Typography>
                <Typography variant="h6">Date: {moment().format('YYYY-MM-DD')}</Typography>
              </div>
            </div>
            {/* Client and Company Info */}
            <Grid container spacing={3} style={{ marginTop: '20px' }}>
              <Grid item xs={6} style={{ borderRight: '2px solid #004d40', paddingRight: '20px' }}>
                <Typography variant="h6" style={{ fontWeight: 'bold', color: '#004d40' }}>
                  From:
                </Typography>
                <Typography>Krishna Industries</Typography>
                <Typography>Peelamedu, Singanallur</Typography>
                <Typography>Coimbatore, 627757</Typography>
                <Typography>Phone: +91-1234567890</Typography>
                <Typography>
                  Email:<span style={{ color: '#004d40' }}>info@krishnaindustries.com</span>
                </Typography>
              </Grid>
              <Grid item xs={6} style={{ paddingLeft: '20px' }}>
                <Typography variant="h6" style={{ fontWeight: 'bold', color: '#004d40' }}>
                  To:
                </Typography>
                <Typography>{customer.cust_name}</Typography>
                <Typography>Phone: {customer.cust_phone}</Typography>
                <Typography>Email: {customer.cust_email}</Typography>
              </Grid>
            </Grid>
            {/* Itemized Table */}
            <TableContainer
              style={{
                marginTop: '20px',
                border: '1px solid #004d40',
                borderRadius: '4px',
                overflow: 'hidden',
                backgroundColor: '#ffffff'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', backgroundColor: '#004d40', color: '#ffffff' }}>
                      S.No
                    </TableCell>
                    <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', backgroundColor: '#004d40', color: '#ffffff' }}>
                      Product Name
                    </TableCell>
                    <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', backgroundColor: '#004d40', color: '#ffffff' }}>
                      Description
                    </TableCell>
                    <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', backgroundColor: '#004d40', color: '#ffffff' }}>
                      Quantity
                    </TableCell>
                    <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', backgroundColor: '#004d40', color: '#ffffff' }}>
                      Price
                    </TableCell>
                    <TableCell style={{ border: '1px solid #ddd', fontWeight: 'bold', backgroundColor: '#004d40', color: '#ffffff' }}>
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ border: '1px solid #ddd' }}>{index + 1}</TableCell>
                      <TableCell style={{ border: '1px solid #ddd' }}>
                        {proData.find((pro) => pro.pro_id === product.pro_id)?.pro_name}
                      </TableCell>
                      <TableCell style={{ border: '1px solid #ddd' }}>
                        {proData.find((pro) => pro.pro_id === product.pro_id)?.description}
                      </TableCell>
                      <TableCell style={{ border: '1px solid #ddd' }}>{product.quantity}</TableCell>
                      <TableCell style={{ border: '1px solid #ddd' }}>{parseFloat(product.price).toFixed(2)}</TableCell>
                      <TableCell style={{ border: '1px solid #ddd' }}>
                        {(parseFloat(product.price) * parseFloat(product.quantity)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Summary and Footer */}
            <div style={{ marginTop: '20px', borderTop: '2px solid #004d40', paddingTop: '10px', textAlign: 'right' }}>
              <Typography variant="h6" style={{ color: '#004d40' }}>
                <span style={{ fontWeight: 'bold' }}>Subtotal:</span> {total.toFixed(2)}
              </Typography>
              <Typography variant="h6" style={{ color: '#004d40' }}>
                <span style={{ fontWeight: 'bold' }}>CGST 9%:</span> {cgst}
              </Typography>
              <Typography variant="h6" style={{ color: '#004d40' }}>
                <span style={{ fontWeight: 'bold' }}>SGST 9%:</span> {sgst}
              </Typography>
              <Typography variant="h6" style={{ color: '#004d40' }}>
                <span style={{ fontWeight: 'bold' }}>Total Amount:</span> {totalWithTax}
              </Typography>
            </div>
            {/* Payment Terms */}
            <div style={{ marginTop: '20px', borderTop: '2px solid #004d40', paddingTop: '10px' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold', color: '#004d40' }}>
                Payment Terms:
              </Typography>
              <Typography>...</Typography>
            </div>
            <Typography variant="h6" style={{ marginTop: '20px', textAlign: 'center', fontStyle: 'italic', color: '#004d40' }}>
              Thank you for your business!
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQuotation}>Close</Button>
          <Button color="primary" onClick={handleSendEmail}>
            Send to Email
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddCustPurch;
