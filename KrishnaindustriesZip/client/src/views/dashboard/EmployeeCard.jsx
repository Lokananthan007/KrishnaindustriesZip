import { Grid, Card, CardContent, Typography, IconButton, CircularProgress } from '@mui/material';
import axios from 'axios';
import config from '../../config';
import React, { useEffect, useState } from 'react';
import { FaUsersViewfinder } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import './EmpCard.css';

const EmployeeCard = () => {
  const [empTotal, setEmpTotal] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/employee`);
        setEmpTotal(res.data);
      } catch (err) {
        console.log('Employee Total is not fetched.');
        setEmpTotal([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <Card className="styled-emp-card" elevation={5}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <Typography variant="h5" className="styled-emp-card-heading">
                Total Employees
              </Typography>
              {loading ? (
                <div className="loading-container">
                  <CircularProgress className="loading-spinner" />
                  <Typography variant="body1" className="loading-text">
                    Loading employee...
                  </Typography>
                </div>
              ) : (
                <Typography variant="h3" className="styled-emp-value">
                  {empTotal.length}
                </Typography>
              )}
            </Grid>
            <Grid item xs={4} className="icon-container" align="right">
              <IconButton aria-label="user count">
                <FaUsersViewfinder className="styled-emp-icon" />
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmployeeCard;
