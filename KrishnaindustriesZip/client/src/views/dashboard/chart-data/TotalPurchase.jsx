// src/PurchaseChart.js
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import moment from 'moment';

const PurchaseChart = () => {
    const [filter, setFilter] = useState('days');
    const [chartData, setChartData] = useState({});

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:3030/cust_purch/totalPurchaseAmount?filter=${filter}`);
            const data = response.data;

            if (!data || data.length === 0) {
                setChartData({});
                return;
            }

            let labels = [];
            let amounts = [];

            if (filter === 'days') {
                labels = data.map(item => moment(item.date).format('YYYY-MM-DD'));
                amounts = data.map(item => item.total_amount);
            } else if (filter === 'months') {
                labels = data.map(item => `Month ${item.month}`);
                amounts = data.map(item => item.total_amount);
            } else if (filter === 'years' || filter === 'allYears') {
                labels = data.map(item => `Year ${item.year}`);
                amounts = data.map(item => item.total_amount);
            }

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Total Purchase Amount',
                        data: amounts,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderWidth: 1,
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            setChartData({});
        }
    };

    useEffect(() => {
        fetchData();
    }, [filter]);

    return (
        <div>
            <div>
                <button onClick={() => setFilter('days')}>Days</button>
                <button onClick={() => setFilter('months')}>Months</button>
                <button onClick={() => setFilter('years')}>Years</button>
                <button onClick={() => setFilter('allYears')}>All Years</button>
            </div>
            {chartData && chartData.labels ? (
                <Line data={chartData} />
            ) : (
                <p>No data available for the selected filter.</p>
            )}
        </div>
    );
};

export default PurchaseChart;
