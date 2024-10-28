import React from 'react';
import { Grid } from '@mui/material';
import EmpAttendanceChart from './EmpAttendanceChart';
import { gridSpacing } from 'store/constant';

import EmpTodayFlwLeadsCount from './EmpTodayFlwLeadsCount';
import EmpTodayRememberLeadsCount from './EmpTodayRememberLeadsCount';

import EmpQuotationProforma from './EmpQuotation&Proforma';

const EmpDashboard = () => {
  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <EmpTodayFlwLeadsCount />
        </Grid>
        <Grid item container lg={8} md={12} sm={12} xs={12} spacing={gridSpacing}>
          <Grid item xs={12}>
            <EmpAttendanceChart />
          </Grid>
        </Grid>
        {/* Add the new DashboardCards component here */}

        <Grid item container lg={4} md={12} sm={12} xs={12} spacing={gridSpacing}>
          <Grid item xs={12}>
            <EmpTodayRememberLeadsCount />
          </Grid>
          <Grid item container spacing={gridSpacing} sx={{ marginTop: '10px', marginLeft: '20px' }}>
            <EmpQuotationProforma /> {/* This component contains the new cards for total quotations and total proformas */}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default EmpDashboard;
