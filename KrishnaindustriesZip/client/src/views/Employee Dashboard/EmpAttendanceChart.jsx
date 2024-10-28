import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, TextField, Typography, Box } from '@mui/material';
import { gridSpacing } from 'store/constant';
import moment from 'moment';
import config from '../../config';
const EmpAttendanceChart = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const [year, setYear] = useState(moment().format('YYYY'));
  const empId = sessionStorage.getItem('emp_id');

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/emp_attend/empAttendChart/?empId=${empId}&year=${year}`);
        console.log('Attendance data fetched:', response.data); // Log the fetched data
        setAttendanceData(response.data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    fetchAttendanceData();
  }, [year, empId]);

  useEffect(() => {
    const fetchEmployeeName = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/employee/name/${empId}`);
        setEmployeeName(response.data.emp_name);
      } catch (error) {
        console.error('Error fetching employee name:', error);
      }
    };

    fetchEmployeeName();
  }, [empId]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const pieChartData = {
    series: attendanceData.map((data) => data.count),
    options: {
      chart: {
        type: 'pie',
        height: 400
      },
      labels: attendanceData.map((data) => `${months[data.month - 1]}: ${data.count}`),
      colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8', '#F77E53', '#DADADA'],
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          }
        }
      }
    }
  };

  return (
    <>
      <MainCard>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={8} md={12} sm={12} xs={12}>
            <Box textAlign="center">
              <Typography variant="h1" gutterBottom>
                {employeeName}
              </Typography>
              <Typography variant="h2">Employee Attendance</Typography>
            </Box>
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <TextField
              label="Enter Year"
              value={year}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setYear(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
        <ReactApexChart options={pieChartData.options} series={pieChartData.series} type="pie" height={400} />
      </MainCard>
    </>
  );
};

export default EmpAttendanceChart;
