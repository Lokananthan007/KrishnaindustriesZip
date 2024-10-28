const express = require('express');
const router = express.Router();
const moment = require('moment');

module.exports = (db) => {

    const moment = require('moment');







    router.get('/empAttendChart', (req, res) => {
        try {
            const empId = req.query.empId;
            const year = req.query.year;
            console.log("Year:", year);

            let getQuery = `SELECT MONTH(dateandtime) AS month, COUNT(*) AS count 
                            FROM attendance 
                            WHERE employee_id = ?`;

            const queryParams = [empId];

            if (year) {
                getQuery += ` AND YEAR(dateandtime) = ?`;
                queryParams.push(year);
            }

            getQuery += ` AND status = 'Present' GROUP BY MONTH(dateandtime)`;

            // Execute the query
            db.query(getQuery, queryParams, (error, results) => {
                if (error) {
                    console.error('Error fetching data:', error);
                    res.status(500).json({ message: 'Internal server error.' });
                } else {
                    // console.log("Results from DB:", results); // Log results
                    res.status(200).json(results);
                }
            });
        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({ message: 'Internal server error.' });
        }
    });



    // =============================================================

    router.get('/employeesdatas', (req, res) => {
        const query = 'SELECT emp_id, emp_name FROM employee';
        db.query(query, (error, results) => {
            if (error) {
                res.status(500).json({ error: 'Error fetching employee data' });
            } else {
                res.json(results);
            }
        });
    });


    router.post('/saveattendance', (req, res) => {
        const { attendanceData } = req.body; // Array of employee attendance

        // Get the current date
        const currentDate = moment().format('YYYY-MM-DD'); // Adjust format as needed

        // Prepare the values for insertion, including reason
        const values = attendanceData.map(item => [item.employee_id, currentDate, item.status, item.reason]);

        const query = `
          INSERT INTO attendance (employee_id, dateandtime, status, reason)
          VALUES ?
          ON DUPLICATE KEY UPDATE status = VALUES(status), reason = VALUES(reason)
        `;
        db.query(query, [values], (error, results) => {
            if (error) {
                console.error('Error submitting attendance', error);
                res.status(500).json({ error: 'Error submitting attendance' });
            } else {
                res.json({ message: 'Attendance recorded successfully' });
            }
        });
    });




    // GET /getattendance?date=YYYY-MM-DD
    router.get('/getattendance', async (req, res) => {
        const { date } = req.query; // Retrieve the date from query parameters

        if (!date) {
            return res.status(400).json({ message: 'Date query parameter is required.' });
        }

        try {
            // Ensure the date is in the correct format (e.g., 'YYYY-MM-DD')
            const query = `
        SELECT a.employee_id, a.status,a.reason, e.emp_name 
        FROM attendance a
        JOIN employee e ON a.employee_id = e.emp_id
        WHERE DATE(a.dateandtime) = ?
      `;

            db.query(query, [date], (error, results) => {
                if (error) {
                    console.error('Error fetching attendance data:', error);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                res.status(200).json(results);
            });
        } catch (error) {
            console.error('Error in getAttendance:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });


    router.get('/monthly-attendance', (req, res) => {
        const { month, year } = req.query; // Expecting month and year from the frontend

        // Format the start and end of the month for querying
        const startDate = moment(`${year}-${month}-01`).startOf('month').format('YYYY-MM-DD');
        const endDate = moment(`${year}-${month}-01`).endOf('month').format('YYYY-MM-DD');

        // Query to get total Present, Absent, and Office Leave counts for each employee within the selected month
        const query = `
          SELECT 
            e.emp_id, 
            e.emp_name,
            SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS total_present,
            SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS total_absent,
            SUM(CASE WHEN a.status = 'Office Leave' THEN 1 ELSE 0 END) AS total_office_leave
          FROM employee e
          LEFT JOIN attendance a ON e.emp_id = a.employee_id
          WHERE a.dateandtime BETWEEN ? AND ?
          GROUP BY e.emp_id
          ORDER BY e.emp_name;
        `;

        db.query(query, [startDate, endDate], (error, results) => {
            if (error) {
                console.error('Error fetching monthly attendance', error);
                return res.status(500).json({ error: 'Failed to fetch monthly attendance data' });
            }

            res.json(results); // Send the results back to the frontend
        });
    });



    router.get('/employee-attendance/:empId', (req, res) => {
        const { empId } = req.params;
        const { month, year } = req.query;

        // Format the start and end of the month for querying
        const startDate = moment(`${year}-${month}-01`).startOf('month').format('YYYY-MM-DD');
        const endDate = moment(`${year}-${month}-01`).endOf('month').format('YYYY-MM-DD');

        // Query to get date-wise attendance for the selected employee
        const query = `
            SELECT 
              a.dateandtime, 
              a.status 
            FROM attendance a
            WHERE a.employee_id = ? 
            AND a.dateandtime BETWEEN ? AND ?
            ORDER BY a.dateandtime;
        `;

        db.query(query, [empId, startDate, endDate], (error, results) => {
            if (error) {
                console.error('Error fetching employee attendance details', error);
                return res.status(500).json({ error: 'Failed to fetch employee attendance details' });
            }

            res.json(results); // Send the results back to the frontend
        });
    });

    return router;
}