// src/components/SalesChart.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

const SalesChart = () => {
  const [filterType, setFilterType] = useState('day');
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, [filterType]);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3030/sales/totalSalesAmount`, {
        params: { filterType }
      });
      const data = response.data;
      formatChartData(data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
    setLoading(false);
  };

  const formatChartData = (data) => {
    let labels = [];
    let values = [];

    if (filterType === 'day') {
      labels = data.map((item) => moment(item.date).format('DD MMM YYYY'));
      values = data.map((item) => item.totalPurchaseAmount);
    } else if (filterType === 'month') {
      labels = data.map((item) => moment(item.month, 'MM').format('MMMM'));
      values = data.map((item) => item.totalPurchaseAmount);
    } else if (filterType === 'year') {
      labels = data.map((item) => item.year);
      values = data.map((item) => item.totalPurchaseAmount);
    } else if (filterType === 'allYears') {
      labels = ['All Years'];
      values = [data[0].totalPurchaseAmount];
    }

    setChartData({
      labels,
      datasets: [
        {
          label: 'Total Sales Amount',
          data: values,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true
        }
      ]
    });
  };

  return (
    <div>
      <div>
        <label htmlFor="filter">Filter by: </label>
        <select id="filter" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="day">Day</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
          <option value="allYears">All Years</option>
        </select>
      </div>
      {loading ? <p>Loading...</p> : <Line data={chartData} />}
    </div>
  );
};

export default SalesChart;
