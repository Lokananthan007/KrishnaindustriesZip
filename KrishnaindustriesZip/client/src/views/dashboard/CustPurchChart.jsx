import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

// Material-UI components
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chart from 'react-apexcharts';
import config from '../../config';
import { Box } from '@mui/material';

// ===========================|| DASHBOARD DEFAULT - BAJAJ AREA CHART CARD ||=========================== //

// Define the component
const CustPurchChart = () => {
  const theme = useTheme();
  const orangeDark = theme.palette.secondary[800];
  const customization = useSelector((state) => state.customization);
  const { navType } = customization;

  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        id: 'support-chart',
        sparkline: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 1
      },
      tooltip: {
        fixed: {
          enabled: false
        },
        x: {
          show: true // Show x-axis label
        },
        y: {
          formatter: (value, { seriesIndex, dataPointIndex, w }) => {
            return `Total ${value}`;
          },
          title: {
            formatter: (seriesName, { seriesIndex, dataPointIndex, w }) => {
              return w.config.xaxis.categories[dataPointIndex];
            }
          }
        },
        marker: {
          show: false
        }
      },
      xaxis: {
        categories: []
      }
    }
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [customerDetails, setCustomerDetails] = useState([]);

  // Fetch customer transaction data
  useEffect(() => {
    axios
      .get(`${config.apiUrl}/quotation/customers-transactions`)
      .then((response) => {
        const data = response.data;
        const names = data.map((item) => item.leads_name);
        const totalAmounts = data.map((item) => parseFloat(item.total_with_tax_sum) || 0); // Use total_with_tax_sum
        const total = totalAmounts.reduce((acc, curr) => acc + curr, 0);

        setTotalAmount(total);
        setCustomerDetails(data); // Store customer details

        setChartData((prevState) => ({
          ...prevState,
          series: [
            {
              name: 'Total Amount',
              data: totalAmounts
            }
          ],
          options: {
            ...prevState.options,
            xaxis: {
              categories: names
            },
            colors: [orangeDark],
            tooltip: {
              theme: 'light',
              y: {
                formatter: (value) => `Total ${value}`,
                title: {
                  formatter: (seriesName, { seriesIndex, dataPointIndex, w }) => {
                    return w.config.xaxis.categories[dataPointIndex];
                  }
                }
              }
            }
          }
        }));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [orangeDark]);

  // Update chart options when navType or colors change
  useEffect(() => {
    const newSupportChart = {
      ...chartData.options,
      colors: [orangeDark],
      tooltip: { theme: 'light' }
    };
    ApexCharts.exec('support-chart', 'updateOptions', newSupportChart);
  }, [navType, orangeDark, chartData.options]);

  return (
    <Card sx={{ bgcolor: 'secondary.light' }}>
      <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
        <Grid item xs={8}>
          {/* Left side - Customer Details */}
          <Typography variant="subtitle1" sx={{ color: 'secondary.dark' }}>
            Customer Transaction Details
          </Typography>
        </Grid>

        <Grid item xs={4}>
          {/* Right side - Total Amount */}
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle1" sx={{ color: 'secondary.dark' }}>
                Total Amount
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" sx={{ color: 'grey.800' }}>
                {totalAmount.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Chart options={chartData.options} series={chartData.series} type="area" height={205} />
    </Card>
  );
};

export default CustPurchChart;
