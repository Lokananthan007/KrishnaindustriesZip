import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Material-UI components
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';

// Project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import config from '../../config';
import CustPurchChart from './CustPurchChart';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const CustomertAmountDetailsCard = ({ isLoading }) => {
  const [customerData, setCustomerData] = useState([]);
  const [showAll, setShowAll] = useState(false); // State to control showing all rows

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/quotation/customers-transactions`);
        setCustomerData(response.data);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };

    fetchData();
  }, []);

  const handleToggleShowAll = () => {
    setShowAll(!showAll); // Toggle between showing all rows and only four
  };

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <CustPurchChart />
              </Grid>
              {customerData.slice(0, showAll ? customerData.length : 4).map((customer, index) => {
                const totalAmount = parseFloat(customer.total_with_tax_sum);
                const paidAmount = parseFloat(customer.paidAmount_sum);
                const balance = parseFloat(customer.balance_sum);

                // Determine the payment status
                const paymentStatus = totalAmount === paidAmount && balance === 0 ? 'Paid' : 'Due';
                const displayedBalance = paymentStatus === 'Due' ? (totalAmount - paidAmount).toFixed(2) : '0.00';

                return (
                  <Grid item xs={12} key={index}>
                    <Grid container direction="column">
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item xs={6} sm={8}>
                            <Typography variant="subtitle1" color="inherit">
                              {customer.leads_name} {/* Updated to reflect leads name */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Grid container alignItems="center" justifyContent="flex-end">
                              <Grid item>
                                <Typography variant="subtitle1" color="inherit">
                                  {totalAmount.toFixed(2)} {/* Display total amount */}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Avatar
                                  variant="rounded"
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '5px',
                                    bgcolor: paymentStatus === 'Due' ? 'error.light' : 'success.light',
                                    color: paymentStatus === 'Due' ? 'error.dark' : 'success.dark',
                                    ml: 2
                                  }}
                                >
                                  {/* <ChevronRightOutlinedIcon fontSize="small" color="inherit" /> */}
                                </Avatar>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle2" sx={{ color: paymentStatus === 'Due' ? 'error.dark' : 'success.dark' }}>
                          {paymentStatus} {paidAmount.toFixed(2)} / Balance {displayedBalance}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 1.5 }} />
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation onClick={handleToggleShowAll}>
              {showAll ? 'View Less' : 'View All'} {/* Toggle button text */}
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
};

CustomertAmountDetailsCard.propTypes = {
  isLoading: PropTypes.bool
};

export default CustomertAmountDetailsCard;
