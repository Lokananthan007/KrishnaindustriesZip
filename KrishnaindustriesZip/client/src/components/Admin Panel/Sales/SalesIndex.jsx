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
  TablePagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Typography
} from '@mui/material';
import config from '../../../config';
import './Print.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const SalesReport = () => {
  const [salesData, setSalesData] = useState([]); // Raw data from the server
  const [filteredData, setFilteredData] = useState([]); // Data to display after filtering
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedMonth, setSelectedMonth] = useState(''); // Selected month for filtering
  const [selectedYear, setSelectedYear] = useState(''); // Selected year for filtering
  const [page, setPage] = useState(0); // Pagination page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const [isPrintMode, setIsPrintMode] = useState(false); // Flag for print mode

  const currentYear = new Date().getFullYear();

  // Fetch sales data from the server
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/sales/salesReport`);
        setSalesData(response.data); // Store the raw data
        setFilteredData(response.data); // Initialize filtered data with raw data
      } catch (error) {
        console.error('Error fetching sales report:', error);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    fetchSalesData();
  }, []);

  // Filter data by month and year
  const applyDateFilters = (data, month, year) => {
    return data.filter((row) => {
      const invoiceDate = new Date(row.invoice_date);
      const matchesMonth = month ? invoiceDate.getMonth() + 1 === parseInt(month) : true;
      const matchesYear = year ? invoiceDate.getFullYear() === parseInt(year) : true;
      return matchesMonth && matchesYear;
    });
  };

  // Main function to apply filters
  const applyFilters = () => {
    let filtered = salesData;
    filtered = applyDateFilters(filtered, selectedMonth, selectedYear); // Apply month and year filters
    setFilteredData(filtered); // Update the filtered data
    setPage(0); // Reset pagination to the first page after filtering
  };

  // Apply filters when month, year, or raw data changes
  useEffect(() => {
    applyFilters();
  }, [selectedMonth, selectedYear, salesData]);

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when changing rows per page
  };

  const handleDownload = () => {
    const printHiddenElements = document.querySelectorAll('.no-print');

    // Hide elements that should not be printed
    printHiddenElements.forEach((element) => {
      element.style.display = 'none';
    });

    const pdf = new jsPDF('p', 'mm', 'a4');

    // Add title or any heading to the PDF
    pdf.setFontSize(18);
    pdf.text('Sales Report', 90, 22);

    // Define table column headers
    const columns = [
      { header: 'Serial No.', dataKey: 'serialNo' },
      { header: 'Leads Name', dataKey: 'leadsName' },
      { header: 'Product Name', dataKey: 'productName' },
      { header: 'Quantity', dataKey: 'quantity' },
      { header: 'Price', dataKey: 'price' },
      { header: 'Total Price', dataKey: 'totalPrice' },
      { header: 'Invoice Date', dataKey: 'invoiceDate' }
    ];

    // Prepare the table data
    const rows = displayedData.map((row, index) => ({
      serialNo: startIndex + index + 1,
      leadsName: row.leads_name,
      productName: row.pro_name || 'N/A',
      quantity: row.quantity,
      price: row.price,
      totalPrice: (row.price * row.quantity).toFixed(2),
      invoiceDate: new Date(row.invoice_date).toLocaleDateString()
    }));

    // Create the table in the PDF
    pdf.autoTable({
      columns: columns,
      body: rows,
      margin: { top: 30 },
      theme: 'grid',
      headStyles: { fillColor: [255, 0, 0] }, // Optional styling
      footStyles: { fillColor: [0, 255, 0] },
      didDrawPage: function (data) {
        // Add page numbers at the bottom
        const pageCount = pdf.internal.getNumberOfPages();
        pdf.setFontSize(10);
        pdf.text(`Page ${pageCount}`, 100, pdf.internal.pageSize.height - 10);
      }
    });

    // Save the PDF
    pdf.save('Sales_Report.pdf');

    // Restore hidden elements after saving PDF
    printHiddenElements.forEach((element) => {
      element.style.display = '';
    });
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state if data is still being fetched
  }

  // Calculate the displayed data based on pagination or show all data in print mode
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedData = isPrintMode ? filteredData : filteredData.slice(startIndex, endIndex); // Show all data in print mode

  return (
    <>
      <Typography variant="h1" align="center" marginTop={'20px'} marginBottom={'40px'}>
        Sales Report
      </Typography>

      {/* Month and Year Filters */}
      <Grid container spacing={2} style={{ marginBottom: '20px' }} className="no-print">
        <Grid item xs={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="month-select-label">Select Month</InputLabel>
            <Select
              labelId="month-select-label"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              label="Select Month"
            >
              <MenuItem value="">
                <em>All Months</em>
              </MenuItem>
              {[...Array(12).keys()].map((month) => (
                <MenuItem key={month + 1} value={month + 1}>
                  {new Date(0, month).toLocaleString('default', { month: 'long' })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="year-select-label">Select Year</InputLabel>
            <Select labelId="year-select-label" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} label="Select Year">
              <MenuItem value="">
                <em>All Years</em>
              </MenuItem>
              {[...Array(10).keys()].map((year) => (
                <MenuItem key={currentYear - year} value={currentYear - year}>
                  {currentYear - year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Print Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleDownload}
        style={{ marginBottom: '20px', float: 'right' }}
        className="no-print"
      >
        Downlode PDF
      </Button>

      {/* Sales Data Table */}
      <TableContainer component={Paper} className="print-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Serial No.</TableCell>
              <TableCell>Leads Name</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Invoice Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>{row.leads_name}</TableCell>
                <TableCell>{row.pro_name || 'N/A'}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>{(row.price * row.quantity).toFixed(2)}</TableCell>
                <TableCell>{new Date(row.invoice_date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!isPrintMode && ( // Only show pagination controls when not in print mode
        <TablePagination
          rowsPerPageOptions={[10, 20, 50, 100, filteredData.length]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="no-print"
        />
      )}
    </>
  );
};

export default SalesReport;
