import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';

const TodayAttendance = () => {
    const [totalAttendanceCount, setTotalAttendanceCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTodayAttendanceCount = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/todayAttendance`);
                const { attendance } = response.data;
                setTotalAttendanceCount(attendance ? attendance.length : 0); // Ensure attendance is an array
            } catch (err) {
                setError(err.response ? err.response.data.message : "Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchTodayAttendanceCount();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Today's Attendance</h1>
            <p>Total Employee Attendance Today: {totalAttendanceCount}</p>
        </div>
    );
};

export default TodayAttendance;
