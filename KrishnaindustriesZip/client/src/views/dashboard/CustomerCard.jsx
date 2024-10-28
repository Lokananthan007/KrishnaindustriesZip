import React, { useEffect, useState } from 'react';
import './CustomerCard.css';
import { Grid, Card, CardContent, Typography, IconButton, CircularProgress } from '@mui/material';
import { FaUsersViewfinder } from 'react-icons/fa6';
import axios from 'axios';
import config from '../../config';

const CustomerCard = () => {
  const [custTotal, setCustTotal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/customer/getCustomer`);
        setCustTotal(res.data);
      } catch (err) {
        console.log('Customer Total is not fetched.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []); // Empty dependency array to run the effect only once

  return (
    <Card className="cust-card" elevation={5}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8}>
            <Typography variant="h3" className="cust-card-heading">
              Total Customers
            </Typography>
            {loading ? (
              <div className="loading-container">
                <CircularProgress className="loading-spinner" />
                <Typography variant="body1" className="loading-text">
                  Loading customers...
                </Typography>
              </div>
            ) : (
              <Typography variant="h3" color="#fff" className="cust-value">
                {custTotal.length}
              </Typography>
            )}
          </Grid>
          <Grid item xs={4} className="icon-container" align="right">
            <IconButton aria-label="user count">
              <FaUsersViewfinder className="cust-icon" />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
