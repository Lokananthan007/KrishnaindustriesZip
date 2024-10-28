// src/components/ProfitChart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import moment from 'moment';

const ProfitChart = () => {
  const [filter, setFilter] = useState('days');
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfitData(filter);
  }, [filter]);

  const fetchProfitData = async (filter) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3030/sales/profit?filter=${filter}`);
      const data = response.data;
      const labels = data.map(item => {
        if (filter === 'days') return moment(item.date).format('YYYY-MM-DD');
        if (filter === 'months') return `Month ${item.month}`;
        if (filter === 'years' || filter === 'allYears') return item.year;
        return item.date;
      });
      const profits = data.map(item => item.profit);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Profit',
            data: profits,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
          },
        ],
      });
    } catch (err) {
      setError('Error fetching data');
    }
    setLoading(false);
  };

  return (
    <div>
      <div>
        <label htmlFor="filter">Filter by: </label>
        <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="days">Days</option>
          <option value="months">Months</option>
          <option value="years">Years</option>
          <option value="allYears">All Years</option>
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Line data={chartData} />
      )}
    </div>
  );
};

export default ProfitChart;
