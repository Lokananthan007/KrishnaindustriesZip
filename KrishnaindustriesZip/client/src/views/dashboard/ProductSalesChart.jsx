import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// apexcharts
import Chart from 'react-apexcharts';
import config from '../../config';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, MenuItem, TextField } from '@mui/material';

// Utility function to generate random colors
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const CustPurchChart = ({ isLoading }) => {
  const theme = useTheme();
  const [cityData, setCityData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(''); // Default to empty string for all cities
  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Total Price',
        data: []
      },
      {
        name: 'Total Quantity',
        data: []
      }
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '60%',
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
        categories: []
      },
      yaxis: {
        title: {
          text: 'Values'
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
          formatter: function (val) {
            return val;
          }
        }
      }
    }
  });

  useEffect(() => {
    // Fetching city data
    axios
      .get(`${config.apiUrl}/customer/getCustomer`)
      .then((res) => {
        setCityData(res.data);
      })
      .catch((err) => {
        console.log('City data is not fetched.');
      });
  }, []);

  useEffect(() => {
    // Fetching product sales data based on selected city
    const endpoint = selectedCity
      ? `${config.apiUrl}/product/dashboardForProSale/${selectedCity}`
      : `${config.apiUrl}/product/dashboardForProSale`;

    axios
      .get(endpoint)
      .then((response) => {
        const salesByProduct = response.data; // Adjusted according to the structure you provided

        const categories = salesByProduct.map((item) => item.pro_name);
        const prices = salesByProduct.map((item) => parseFloat(item.total_price));
        const quantities = salesByProduct.map((item) => parseFloat(item.total_quantity));

        setChartData({
          series: [
            {
              name: 'Total Price',
              data: prices
            },
            {
              name: 'Total Quantity',
              data: quantities
            }
          ],
          options: {
            ...chartData.options,
            xaxis: {
              categories: categories
            }
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching dashboard data:', error);
      });
  }, [selectedCity]);

  return (
    <div>
      {isLoading ? (
        <>
          <Typography variant="h6">Loading...</Typography>
          <h3 style={{ textAlign: 'center', color: theme.palette.primary.main }}>SALES</h3>
        </>
      ) : (
        <MainCard>
          <h3 style={{ textAlign: 'center', color: theme.palette.primary.main }}>SALES</h3>
          <Grid container spacing={3}>
            <Grid item xs={4} display="flex" justifyContent="start">
              <TextField select fullWidth label="Select City" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                <MenuItem value="">Select All</MenuItem>
                {cityData.map((city) => (
                  <MenuItem key={city.leads_id} value={city.leads_city}>
                    {city.leads_city}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Chart options={chartData.options} series={chartData.series} type="bar" height={450} />
        </MainCard>
      )}
    </div>
  );
};

CustPurchChart.propTypes = {
  isLoading: PropTypes.bool
};

export default CustPurchChart;
