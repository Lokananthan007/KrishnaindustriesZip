import React from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { Button, Typography, Snackbar, Alert } from '@mui/material';
import config from '../../../config'; // Assuming you have the API URL configured here

const ExcelUpload = () => {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

      // Mapping the Excel data to your purchases table structure
      const formattedData = jsonData.map((row) => ({
        productName: row['Product Name'], // Ensure these match your Excel column headers
        productId: row['Product ID'],
        specification: row['Specification'],
        quantity: row['Quantity'],
        price: row['Price'],
        gst: row['GST'],
        cgst: row['CGST'],
        sgst: row['SGST'],
        totalPrice: row['Total Price'],
        totalPriceWithGST: row['Total Price with GST'],
        fromName: row['From Name'],
        address: row['Address'],
        street: row['Street'],
        city: row['City'],
        state: row['State'],
        pinCode: row['Pin Code']
      }));

      try {
        // Send the formatted data to the backend for processing and insertion into the database
        await axios.post(`${config.apiUrl}/purchase/uploadexclepurchases`, formattedData);
        setSnackbarMessage('File uploaded successfully!');
        setSnackbarSeverity('success');
      } catch (error) {
        console.error('Error uploading file:', error);
        setSnackbarMessage('Error uploading file. Please try again.');
        setSnackbarSeverity('error');
      } finally {
        setSnackbarOpen(true);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const exportToExcel = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.apiUrl}/leads/api/leads-data`); // Call to your backend API
      const leadsData = response.data;

      // Format data for Excel export
      const formattedData = leadsData.map((lead) => ({
        'Query ID': lead.UNIQUE_QUERY_ID,
        'Query Type': lead.QUERY_TYPE,
        'Query Time': lead.QUERY_TIME,
        'Sender Name': lead.SENDER_NAME,
        'Sender Mobile': lead.SENDER_MOBILE,
        'Sender Email': lead.SENDER_EMAIL,
        Subject: lead.SUBJECT,
        Company: lead.SENDER_COMPANY,
        Address: lead.SENDER_ADDRESS,
        City: lead.SENDER_CITY,
        State: lead.SENDER_STATE,
        Pincode: lead.SENDER_PINCODE,
        'Country ISO': lead.SENDER_COUNTRY_ISO,
        'Alt Mobile': lead.SENDER_MOBILE_ALT,
        Phone: lead.SENDER_PHONE,
        'Alt Phone': lead.SENDER_PHONE_ALT,
        'Alt Email': lead.SENDER_EMAIL_ALT,
        'Product Name': lead.QUERY_PRODUCT_NAME,
        Message: lead.QUERY_MESSAGE,
        'MCAT Name': lead.QUERY_MCAT_NAME,
        'Call Duration': lead.CALL_DURATION,
        'Receiver Mobile': lead.RECEIVER_MOBILE
      }));

      // Generate Excel file
      const worksheet = utils.json_to_sheet(formattedData);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'Leads Data');

      // Download the Excel file
      writeFile(workbook, 'LeadsData.xlsx');
    } catch (error) {
      console.error('Error exporting leads data to Excel:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', marginTop: '20px' }}>
      <input {...getInputProps()} />
      <Typography variant="h6">Drag and drop an Excel file here, or click to select one</Typography>
      <Button variant="contained" color="primary" style={{ marginTop: '10px' }}>
        Upload Excel
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ExcelUpload;
