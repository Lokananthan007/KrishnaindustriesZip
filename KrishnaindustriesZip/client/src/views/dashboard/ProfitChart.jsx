import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Material-UI
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';

// ApexCharts
import Chart from 'react-apexcharts';
import config from '../../config';
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| TOTAL PROFIT CHART ||============================== //
const TotalProfitChart = ({ isLoading }) => {
  const theme = useTheme();
  const [totals, setTotals] = useState({ total_sales: 0, total_purchases: 0 });
  const [profit, setProfit] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/quotation/financial-data`);
        const data = res.data;

        // Ensure values are numbers
        const totalSales = parseFloat(data.totalSales) || 0; // Convert to float
        const totalPurchases = parseFloat(data.totalPurchases) || 0; // Convert to float

        setTotals({ total_sales: totalSales, total_purchases: totalPurchases });
        setProfit(totalSales - totalPurchases); // Calculate profit
      } catch (err) {
        console.error('Error fetching total data:', err);
        setError('Failed to fetch financial data.');
      }
    };

    fetchFinancialData();
  }, []);

  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Total Sales',
        data: [0] // Initial value
      },
      {
        name: 'Total Purchases',
        data: [0] // Initial value
      },
      {
        name: 'Profit',
        data: [0] // Initial value
      }
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
          endingShape: 'rounded'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Sales - Purchases - Profit'], // Updated categories
        labels: {
          style: {
            colors: theme.palette.text.primary, // Use theme colors
            fontSize: '14px',
            width:'3',
            fontWeight: 600
          },
          offsetY: 3, // Adjust the vertical offset for label positioning
          offsetX: 3,
        },
        // tickPlacement: 'on' // Ensure ticks align with categories
      },
      yaxis: {
        title: {
          text: 'Amount'
        },
        labels: {
          formatter: (value) => `₹${value.toFixed(2)}` // Format y-axis labels
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [0, 50, 100]
        }
      },
      tooltip: {
        y: {
          formatter: (val) => `₹${val.toFixed(2)}`
        }
      }
    }
  });

  useEffect(() => {
    // Update chart data when totals or profit changes
    setChartData((prevState) => ({
      ...prevState,
      series: [
        {
          name: 'Total Sales',
          data: [totals.total_sales.toFixed(2)] // Update total sales
        },
        {
          name: 'Total Purchases',
          data: [totals.total_purchases.toFixed(2)] // Update total purchases
        },
        {
          name: 'Profit',
          data: [profit.toFixed(2)] // Update profit for the chart
        }
      ]
    }));
  }, [totals, profit]);

  const handleCloseSnackbar = () => {
    setError(null);
  };

  return (
    <div>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <MainCard>
          <Typography variant="h4" align="center" color={theme.palette.primary.main}>
            PROFIT
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="h6">
                Total Sales: <CurrencyRupeeOutlinedIcon />
                {totals.total_sales.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">
                Total Purchases: <CurrencyRupeeOutlinedIcon />
                {totals.total_purchases.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
          <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />
        </MainCard>
      )}

      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleCloseSnackbar} message={error} />
    </div>
  );
};

TotalProfitChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalProfitChart;
