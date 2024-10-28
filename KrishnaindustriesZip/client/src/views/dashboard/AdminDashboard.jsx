// new

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import EmployeeCard from './EmployeeCard';
import CustomertAmountDetailsCard from './CustomertAmountDetailsCard';
import CustomerCard from './CustomerCard';
import TodayFlwLeadsCount from './TodayFlwLeadsCount';
import TodayRememberLeadsCount from './TodayRememberLeadsCount';
import ProductSalesChart from './ProductSalesChart';
import TotalProfitChart from './ProfitChart';
import { gridSpacing } from 'store/constant';
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import PurchaseStatus from './deliverydetails';

const AdminDashboard = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing} marginTop={'1px'}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EmployeeCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <CustomerCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12}>
                <TodayFlwLeadsCount isLoading={isLoading} />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TodayRememberLeadsCount
                  {...{
                    isLoading: isLoading,
                    total: 203,
                    label: 'Total Income',
                    icon: <StorefrontTwoToneIcon fontSize="inherit" />
                  }}
                />
              </Grid>
              <Grid item sm={12} xs={6}>
                <PurchaseStatus isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={8} md={12} xs={12}>
            <Grid container>
              <Grid item xs={12} marginTop={'-100px'}>
                <ProductSalesChart isLoading={isLoading} />
              </Grid>
              <Grid item xs={12}>
                <TotalProfitChart isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={4} md={12} xs={12}>
            <CustomertAmountDetailsCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
