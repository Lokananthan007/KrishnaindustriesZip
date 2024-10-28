import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';

const AttendanceCard = ({ title, count }) => (
  <Card style={{ margin: '20px', width: '300px' }}>
    <CardContent>
      <Typography variant="h5" component="div">{title}</Typography>
      <Typography variant="h6">{count}</Typography>
    </CardContent>
  </Card>
);

const AttendanceDashboard = () => {
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [todayAttendance, setTodayAttendance] = useState(0);

  useEffect(() => {
    // Fetch total attendance
    axios.get('/api/attendance')
      .then(response => setTotalAttendance(response.data.attendance.length))
      .catch(error => console.error('Error fetching total attendance:', error));

    // Fetch today's attendance
    axios.get('/api/todayAttendance')
      .then(response => setTodayAttendance(response.data.attendance.length))
      .catch(error => console.error('Error fetching today\'s attendance:', error));
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <AttendanceCard title="Total Attendance" count={totalAttendance} />
      <AttendanceCard title="Today's Attendance" count={todayAttendance} />
    </div>
  );
};

export default AttendanceDashboard;
