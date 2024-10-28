import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, Typography, Box, Avatar } from '@mui/material';
import { FaUsers } from 'react-icons/fa';
import axios from 'axios';
import config from '../../config';
import './card1.css'; // Import your CSS file

const EmpTodayRememberLeadsCount = () => {
  const theme = useTheme();
  const [leadsCount, setLeadsCount] = useState([]);
  const empId = sessionStorage.getItem('emp_id');

  useEffect(() => {
    axios
      .get(`${config.apiUrl}/leads/leadsCountForEmpDashboard/${empId}`)
      .then((res) => {
        setLeadsCount(res.data);
      })
      .catch((err) => {
        console.log("Leads Data can't be fetched.");
      });
  }, [empId]);

  return (
    <Card className="cust-card5">
      {' '}
      {/* Apply styled-emp-card class here */}
      <Box sx={{ p: 2 }}>
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, height: 60, width: 60 }}>
            <FaUsers size={40} color="white" />
          </Avatar>
        </Box>
        <Typography variant="h3" sx={{ textAlign: 'center' }} className="styled-emp-card-heading">
          Today Remember Leads
        </Typography>
        <Typography variant="h1" sx={{ textAlign: 'center' }} className="styled-emp-value">
          {leadsCount.reminder_date_count}
        </Typography>
      </Box>
    </Card>
  );
};

export default EmpTodayRememberLeadsCount;
