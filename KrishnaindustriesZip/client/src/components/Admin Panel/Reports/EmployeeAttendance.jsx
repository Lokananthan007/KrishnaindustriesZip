// AttendanceApp.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  MenuItem,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Collapse
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import axios from 'axios';
import dayjs from 'dayjs'; // To manage dates
import config from '../../../config';

const MonthlyAttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('MM'));
  const [selectedYear, setSelectedYear] = useState(dayjs().format('YYYY'));
  const [expandedRows, setExpandedRows] = useState({}); // To track expanded rows
  const [employeeAttendanceDetails, setEmployeeAttendanceDetails] = useState({});

  // Month options
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Fetch attendance data based on the selected month and year
  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.apiUrl}/emp_attend/monthly-attendance`, {
        params: { month: selectedMonth, year: selectedYear }
      });
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance data', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch employee attendance details (date-wise)
  const fetchEmployeeAttendanceDetails = async (empId) => {
    try {
      const response = await axios.get(`${config.apiUrl}/emp_attend/employee-attendance/${empId}`, {
        params: { month: selectedMonth, year: selectedYear }
      });
      setEmployeeAttendanceDetails((prev) => ({
        ...prev,
        [empId]: response.data
      }));
    } catch (error) {
      console.error('Error fetching employee attendance details', error);
    }
  };

  // Toggle expand/collapse of employee row
  const handleExpandClick = (empId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [empId]: !prev[empId]
    }));

    // Fetch data if not already fetched
    if (!employeeAttendanceDetails[empId]) {
      fetchEmployeeAttendanceDetails(empId);
    }
  };

  useEffect(() => {
    fetchAttendanceData(); // Fetch data when the component mounts
  }, [selectedMonth, selectedYear]); // Refetch when month or year changes

  return (
    <Container maxWidth="md">
      <Paper style={{ padding: '30px', marginTop: '20px' }}>
        <Typography variant="h1" align="center" marginBottom={'40px'} gutterBottom>
          Monthly Attendance Report
        </Typography>

        {/* Month and Year selection */}
        <Box display="flex" justifyContent="space-between" marginBottom="20px">
          <TextField
            select
            label="Select Month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ marginRight: '10px', minWidth: '200px' }}
          >
            {months.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Select Year"
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{ marginRight: '10px', minWidth: '200px' }}
            inputProps={{ min: 2000, max: dayjs().year() }}
          />

          <Button variant="contained" onClick={fetchAttendanceData}>
            Get Report
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee Name</TableCell>
                <TableCell>Total Present</TableCell>
                <TableCell>Total Absent</TableCell>
                <TableCell>Total Office Leave</TableCell>
                <TableCell>Date-wise Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData.map((row) => (
                <React.Fragment key={row.emp_id}>
                  <TableRow>
                    <TableCell>{row.emp_name}</TableCell>
                    <TableCell>{row.total_present}</TableCell>
                    <TableCell>{row.total_absent}</TableCell>
                    <TableCell>{row.total_office_leave}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleExpandClick(row.emp_id)}>
                        {expandedRows[row.emp_id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Date-wise attendance details */}
                  <TableRow>
                    <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={expandedRows[row.emp_id]} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <Typography variant="h6">Attendance Details for {row.emp_name}</Typography>
                          {employeeAttendanceDetails[row.emp_id] ? (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Date</TableCell>
                                  <TableCell>Status</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {employeeAttendanceDetails[row.emp_id].map((attendance) => (
                                  <TableRow key={attendance.dateandtime}>
                                    <TableCell>{dayjs(attendance.dateandtime).format('YYYY-MM-DD')}</TableCell>
                                    <TableCell>{attendance.status}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <CircularProgress />
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
};

export default MonthlyAttendancePage;
