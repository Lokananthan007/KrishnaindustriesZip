import React, { useState, useEffect } from 'react';
import {
  Container,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Typography,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
  Button,
  TextField // Import for reason input field
} from '@mui/material';
import axios from 'axios';
import config from '../../../config';
import dayjs from 'dayjs'; // Ensure you have dayjs installed: npm install dayjs

const EmployeeAttendancePage = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [officeLeaveReason, setOfficeLeaveReason] = useState(''); // Single state for Office Leave reason
  const [submitMessage, setSubmitMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status

  // Utility function to format date as 'YYYY-MM-DD'
  const getTodayDate = () => dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    const fetchEmployeesAndAttendance = async () => {
      try {
        const employeesResponse = await axios.get(`${config.apiUrl}/emp_attend/employeesdatas`);
        const employeeData = employeesResponse.data;
        setEmployees(employeeData);

        const today = getTodayDate();
        const attendanceResponse = await axios.get(`${config.apiUrl}/emp_attend/getattendance`, {
          params: { date: today }
        });
        const attendanceData = attendanceResponse.data;

        if (attendanceData && attendanceData.length > 0) {
          const attendanceMap = attendanceData.reduce((acc, record) => {
            acc[record.employee_id] = record.status;
            return acc;
          }, {});

          const initialAttendance = employeeData.reduce((acc, employee) => {
            acc[employee.emp_id] = attendanceMap[employee.emp_id] || 'Absent';
            return acc;
          }, {});
          setAttendance(initialAttendance);
          setIsSubmitted(true);
        } else {
          const initialAttendance = employeeData.reduce((acc, employee) => {
            acc[employee.emp_id] = 'Absent';
            return acc;
          }, {});
          setAttendance(initialAttendance);
          setIsSubmitted(false);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data', error);
        setLoading(false);
        setSubmitMessage('Failed to load employee or attendance data.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };

    fetchEmployeesAndAttendance();
  }, []);

  const handleAttendanceChange = (employeeId, status) => {
    if (status !== null && !isSubmitted) {
      setAttendance((prevState) => ({
        ...prevState,
        [employeeId]: status
      }));
    }
  };
  // Handle "Select All" functionality
  const handleSelectAll = (status) => {
    if (!isSubmitted) {
      // Allow select all only if not submitted
      const updatedAttendance = employees.reduce((acc, employee) => {
        acc[employee.emp_id] = status;
        return acc;
      }, {});
      setAttendance(updatedAttendance);
    }
  };

  // Handle "Select All Office Leave" functionality
  const handleSelectAllOfficeLeave = () => {
    if (!isSubmitted) {
      const updatedAttendance = employees.reduce((acc, employee) => {
        acc[employee.emp_id] = 'Office Leave';
        return acc;
      }, {});
      setAttendance(updatedAttendance);
    }
  };

  const handleSubmit = () => {
    const attendanceData = employees.map((employee) => ({
      employee_id: employee.emp_id,
      status: attendance[employee.emp_id] || 'Absent',
      reason: attendance[employee.emp_id] === 'Office Leave' ? officeLeaveReason : null // Use single reason for all employees with "Office Leave"
    }));

    axios
      .post(`${config.apiUrl}/emp_attend/saveattendance`, { attendanceData })
      .then(() => {
        setSubmitMessage('Attendance submitted successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setIsSubmitted(true);
      })
      .catch((error) => {
        console.error('Error submitting attendance', error);
        setSubmitMessage('Failed to submit attendance.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  return (
    <Container maxWidth="md">
      <Paper style={{ padding: '30px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Employee Attendance - {dayjs().format('MMMM D, YYYY')}
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {/* Select All Buttons */}
            <Box display="flex" justifyContent="space-between" marginBottom="20px">
              <Button
                variant="contained"
                color="success"
                onClick={() => handleSelectAll('Present')}
                style={{
                  marginRight: '10px',
                  backgroundColor: isSubmitted ? '#a5d6a7' : '#4caf50',
                  color: '#fff',
                  cursor: isSubmitted ? 'not-allowed' : 'pointer'
                }}
                disabled={isSubmitted}
              >
                Select All Present
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleSelectAll('Absent')}
                style={{
                  backgroundColor: isSubmitted ? '#ef9a9a' : '#f44336',
                  color: '#fff',
                  cursor: isSubmitted ? 'not-allowed' : 'pointer'
                }}
                disabled={isSubmitted}
              >
                Select All Absent
              </Button>

              {/* New "Select All Office Leave" Button */}
              <Button
                variant="contained"
                color="warning"
                onClick={handleSelectAllOfficeLeave} // Trigger Office Leave selection
                style={{
                  backgroundColor: isSubmitted ? '#ffcc80' : '#ffa726',
                  color: '#fff',
                  cursor: isSubmitted ? 'not-allowed' : 'pointer'
                }}
                disabled={isSubmitted}
              >
                Select All Office Leave
              </Button>
            </Box>

            {/* Reason for Office Leave */}
            {Object.values(attendance).includes('Office Leave') && (
              <TextField
                label="Enter Reason for Office Leave"
                variant="outlined"
                fullWidth
                margin="normal"
                value={officeLeaveReason}
                onChange={(e) => setOfficeLeaveReason(e.target.value)}
                disabled={isSubmitted}
              />
            )}

            {employees.map((employee) => (
              <Box key={employee.emp_id} display="flex" alignItems="center" justifyContent="space-between" style={{ marginBottom: '15px' }}>
                <Typography variant="h6" style={{ marginRight: '20px' }}>
                  {employee.emp_id} - {employee.emp_name}
                </Typography>
                <ToggleButtonGroup
                  value={attendance[employee.emp_id] || 'Absent'}
                  exclusive
                  onChange={(e, newStatus) => handleAttendanceChange(employee.emp_id, newStatus)}
                  sx={{ border: '1px solid #0056b3', borderRadius: '4px' }}
                >
                  <ToggleButton
                    value="Present"
                    disabled={isSubmitted} // Disable if already submitted
                    sx={{
                      backgroundColor: attendance[employee.emp_id] === 'Present' ? '#4caf50' : 'transparent', // Full green background for selected
                      color: attendance[employee.emp_id] === 'Present' ? '#fff' : '#000', // White text for selected
                      '&:hover': {
                        backgroundColor: attendance[employee.emp_id] === 'Present' ? '#388e3c' : 'rgba(76, 175, 80, 0.5)', // Lighter green hover if not selected
                        color: '#fff'
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#4caf50', // Active background
                        color: 'white', // Active text color
                        '&:hover': {
                          backgroundColor: '#4caf50' // Darker shade when hovered while active
                        }
                      },
                      border: attendance[employee.emp_id] === 'Present' ? '2px solid #4caf50' : '1px solid #0056b3',
                      boxShadow: attendance[employee.emp_id] === 'Present' ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
                      transition: 'background-color 0.3s, color 0.3s',
                      textTransform: 'none'
                      // textDecoration: attendance[employee.emp_id] === 'Present' ? 'underline' : 'none' // Optional: Underline text if selected
                    }}
                  >
                    {/* Text Background Effect */}
                    <span
                      style={{
                        // backgroundColor: attendance[employee.emp_id] === 'Present' ? '#81c784' : 'transparent',
                        padding: '2px 4px',
                        borderRadius: '3px'
                      }}
                    >
                      Present
                    </span>
                  </ToggleButton>
                  <ToggleButton
                    value="Absent"
                    disabled={isSubmitted} // Disable if already submitted
                    sx={{
                      backgroundColor: attendance[employee.emp_id] === 'Absent' ? '#f44336' : 'transparent', // Full red background for selected
                      color: attendance[employee.emp_id] === 'Absent' ? '#fff' : '#000', // White text for selected
                      '&:hover': {
                        backgroundColor: attendance[employee.emp_id] === 'Absent' ? '#d32f2f' : 'rgba(244, 67, 54, 0.5)', // Lighter red hover if not selected
                        color: '#fff'
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#d32f2f', // Active background
                        color: 'white', // Active text color
                        '&:hover': {
                          backgroundColor: '#d32f2f' // Darker shade when hovered while active
                        }
                      },
                      border: attendance[employee.emp_id] === 'Absent' ? '2px solid #f44336' : '1px solid #0056b3',
                      boxShadow: attendance[employee.emp_id] === 'Absent' ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
                      transition: 'background-color 0.3s, color 0.3s',
                      textTransform: 'none'
                      // textDecoration: attendance[employee.emp_id] === 'Absent' ? 'underline' : 'none' // Optional: Underline text if selected
                    }}
                  >
                    {/* Text Background Effect */}
                    <span
                      style={{
                        // backgroundColor: attendance[employee.emp_id] === 'Absent' ? '#e57373' : 'transparent',
                        padding: '2px 4px',
                        borderRadius: '3px'
                      }}
                    >
                      Absent
                    </span>
                  </ToggleButton>
                  <ToggleButton
                    value="Office Leave"
                    disabled={isSubmitted}
                    sx={{
                      backgroundColor: attendance[employee.emp_id] === 'Office Leave' ? '#ffa726' : 'transparent', // Full red background for selected
                      color: attendance[employee.emp_id] === 'Office Leave' ? '#fff' : '#000', // White text for selected
                      '&:hover': {
                        backgroundColor: attendance[employee.emp_id] === 'Office Leave' ? '#ffa726' : 'rgba(244, 167, 38, 0.5)', // Lighter red hover if not selected
                        color: '#fff'
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#ffa726', // Active background
                        color: 'white', // Active text color
                        '&:hover': {
                          backgroundColor: '#ffa726' // Darker shade when hovered while active
                        }
                      },
                      border: attendance[employee.emp_id] === 'Office Leave' ? '2px solid #f44336' : '1px solid #0056b3',
                      boxShadow: attendance[employee.emp_id] === 'Office Leave' ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
                      transition: 'background-color 0.3s, color 0.3s',

                      textTransform: 'none'
                      // textDecoration: attendance[employee.emp_id] === 'Office Leave' ? 'underline' : 'none' // Optional: Underline text if selected
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: attendance[employee.emp_id] === 'Office Leave' ? '#ffa726' : 'transparent',
                        padding: '2px 4px',
                        borderRadius: '3px'
                      }}
                    >
                      Office Leave
                    </span>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            ))}

            <Box display="flex" justifyContent="space-between" marginTop="20px">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading || employees.length === 0 || isSubmitted}
              >
                Submit Attendance
              </Button>

              {isSubmitted && (
                <Button variant="outlined" color="secondary" onClick={() => setIsSubmitted(false)}>
                  Edit Attendance
                </Button>
              )}
            </Box>
          </Box>
        )}

        <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
          <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} sx={{ width: '100%' }}>
            {submitMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default EmployeeAttendancePage;
