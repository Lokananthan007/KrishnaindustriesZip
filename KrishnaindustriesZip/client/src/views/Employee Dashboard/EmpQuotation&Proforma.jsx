import React, { useEffect, useState } from 'react';
import { Grid, Box, Avatar, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FaFileInvoice, FaFileAlt } from 'react-icons/fa';
import axios from 'axios';
import config from '../../config';
import MainCard from 'ui-component/cards/MainCard';
import { width } from '@mui/system';

const EmpQuotationProforma = () => {
  const theme = useTheme();
  const [quotationCount, setQuotationCount] = useState(0);
  const [proformaCount, setProformaCount] = useState(0);

  useEffect(() => {
    // Fetch total quotations count
    axios
      .get(`${config.apiUrl}/quotation/quotationCount`)
      .then((res) => setQuotationCount(res.data.total_quotations))
      .catch((err) => console.log("Quotation Data can't be fetched."));

    // Fetch total proforma count
    axios
      .get(`${config.apiUrl}/quotation/proformaCount`)
      .then((res) => setProformaCount(res.data.total_proformas))
      .catch((err) => console.log("Proforma Data can't be fetched."));
  }, []);

  return (
    <Grid container spacing={2} direction="column">
      {/* Card for Total Quotations */}
      <Grid item xs={12} sm={6} md={3}>
        <MainCard className="cust-card1" sx={{ height: '100%', width: '90%' }}>
          <Box sx={{ p: 2 }}>
            <Box display="flex" justifyContent="center" mb={1}>
              <Avatar sx={{ bgcolor: theme.palette.success.main, height: 50, width: 50 }}>
                <FaFileInvoice size={30} color="white" />
              </Avatar>
            </Box>
            <Typography variant="h5" className="cust-card-heading" align="center">
              Total Quotations
            </Typography>
            <Typography variant="h4" className="cust-value" align="center">
              {quotationCount}
            </Typography>
          </Box>
        </MainCard>
      </Grid>

      {/* Card for Total Proforma */}
      <Grid item xs={12} sm={6} md={3}>
        <MainCard className="cust-card1" sx={{ height: '100%', width: '90%' }}>
          <Box sx={{ p: 2 }}>
            <Box display="flex" justifyContent="center" mb={1}>
              <Avatar sx={{ bgcolor: theme.palette.warning.main, height: 50, width: 50 }}>
                <FaFileAlt size={30} color="white" />
              </Avatar>
            </Box>
            <Typography variant="h5" className="cust-card-heading" align="center">
              Total Proformas
            </Typography>
            <Typography variant="h4" className="cust-value" align="center">
              {proformaCount}
            </Typography>
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default EmpQuotationProforma;
