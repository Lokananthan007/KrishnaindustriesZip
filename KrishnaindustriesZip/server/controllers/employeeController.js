const express = require('express');
const router = express.Router();
const moment = require('moment');
const axios = require('axios');

module.exports = (db, transporter) => {

  router.get('/', (req, res) => {
    const getData = 'select emp.*,role.role,dept.dept_name,lang.language_name from employee emp inner join department dept on emp.dept_id = dept.dept_id inner join role role on emp.role_id = role.role_id inner join languages lang on emp.lang_id = lang.lang_id';
    db.query(getData, (err, result) => {
      if (err) {
        res.status(500).json({ message: "Internal server error." });
      } else if (result.length === 0) {
        res.status(404).json({ message: "Employee Data not found." });
      } else {
        res.status(200).json(result)
      }
    })
  })

  router.get('/name/:empId', (req, res) => {
    const empId = req.params.empId;

    const query = 'SELECT emp_name FROM employee WHERE emp_id = ?';

    db.query(query, [empId], (err, result) => {
      if (err) {
        console.error('Error fetching employee name:', err);
        res.status(500).json({ message: "Internal server error." });
      } else if (result.length === 0) {
        res.status(404).json({ message: "Employee not found." });
      } else {
        res.status(200).json({ emp_name: result[0].emp_name });
      }
    });
  });

  router.get('/:id/state', async (req, res) => {
    const employeeId = req.params.id;

    try {
      const [rows] = await db.query('SELECT state FROM employees WHERE id = ?', [employeeId]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      res.json({ state: rows[0].state });
    } catch (error) {
      console.error('Error fetching employee state:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  router.post('/saveEmp', (req, res) => {
    const { dept_id, role_id, lang_id, emp_name, emp_email, emp_mobile, state, dist, city, hire_date } = req.body;

    if (!dept_id || !role_id || !lang_id || !emp_name || !emp_email || !emp_mobile || !state || !dist || !city || !hire_date) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const thankingMsg = "Thank you for joining our company! We are thrilled to have you on board.";
    const credentialsMsg = `Your username is: ${emp_email} \n Your password is: ${emp_mobile}`;

    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const saveData = 'insert into employee(dept_id,role_id,lang_id,emp_name,emp_email,emp_mobile,state,dist,city,hire_date,created_at) values(?,?,?,?,?,?,?,?,?,?,?)';
    db.query(saveData, [dept_id, role_id, lang_id, emp_name, emp_email, emp_mobile, state, dist, city, hire_date, currentDate], (err, results) => {
      if (err) {
        console.error("Error saving employee data:", err);
        return res.status(500).json({ message: "Internal server error." });
      } else {
        console.log("Employee data added successfully.");
        const empMail = transporter.sendMail({
          from: "asglobalsofttech@gmail.com",
          to: emp_email,
          subject: "Employee Credentials",
          html: `<h1>Hello ${emp_name},</h1>
              <p>${thankingMsg}</p>
              <p>${credentialsMsg}</p>`
        });

        empMail.then(() => {
          console.log("Email sent successfully.");
        }).catch((error) => {
          console.error("Error sending email:", error);
        });

        return res.status(200).json({ message: "Employee data added successfully." });
      }
    });
  });

  router.put('/update/:id', (req, res) => {
    const emp_id = req.params.id;
    console.log("Employee Id :", emp_id)
    const { dept_id, role_id, lang_id, emp_name, emp_email, emp_mobile, state, dist, city, hire_date } = req.body;
    console.log("Employee Data :", dept_id, role_id, lang_id, emp_name, emp_email, emp_mobile, state, dist, city, hire_date)
    if (!dept_id || !role_id || !lang_id || !emp_name || !emp_email || !emp_mobile || !state || !dist || !city || !hire_date) {
      console.log("All field are required")
    }
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const updateData = 'update employee set dept_id=?,role_id=?,lang_id=?,emp_name=?,emp_email=?,emp_mobile=?,state=?,dist=?,city=?,hire_date=?,updated_at=? where emp_id=?';
    db.query(updateData, [dept_id, role_id, lang_id, emp_name, emp_email, emp_mobile, state, dist, city, hire_date, currentDate, emp_id], (err, result) => {
      if (err) {
        res.status(500).json({ message: "Internal server error." })
        console.log("Employee Data is not updated :", err)
      } else {
        res.status(200).json({ message: "Employee Data Updated successfully." })
      }
    })
  })


  router.delete('/delete/:id', (req, res) => {
    const emp_id = req.params.id;
    const dltData = 'delete from employee where emp_id = ?';
    db.query(dltData, [emp_id], (err, result) => {
      if (err) {
        res.status(500).json({ message: "Internal server error." })
      } else {
        res.status(200).json({ message: "Employee Data Deleted successfully." })
      }
    })
  })

  router.get('/allAttendance', (req, res) => {
    try {
      const getAllAttendanceQuery = 'SELECT * FROM emp_attendance';
      db.query(getAllAttendanceQuery, (error, results) => {
        if (error) {
          console.error('Error fetching data:', error);
          res.status(500).json({ message: 'Internal server error.' });
        } else {
          res.status(200).json(results);
        }
      });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });


  // Inside your employee routes file (e.g., `employeeRoutes.js`)
  router.get('/allEmployees', (req, res) => {
    try {
      const getAllEmployeesQuery = 'SELECT emp_id, emp_name FROM employee'; // Adjust table name and fields as necessary
      db.query(getAllEmployeesQuery, (error, results) => {
        if (error) {
          console.error('Error fetching employees:', error);
          res.status(500).json({ message: 'Internal server error.' });
        } else {
          res.status(200).json(results);
        }
      });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });





  router.get('/getNotcallattedeByEmpId/:emp_id', (req, res) => {
    // console.log(req.body);
    const empId = req.params.emp_id;
    const query = `
      SELECT * FROM following_leads
      WHERE emp_id = ? AND call_Attended = 'Not Attended'
  `;

    db.query(query, [empId], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error fetching data');
        return;
      }
      res.json(results);
    });
  });

  router.post('/UpdateNotattendedleads', (req, res) => {
    const { follow_id, callStatus, callDiscussion, remainder, reminderDate } = req.body;


    console.log(follow_id, callStatus, callDiscussion, remainder, reminderDate);

    // Validate the inputs
    if (!follow_id || !callStatus) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Convert "Yes" or "No" to appropriate format for the `remainder` field
    const remainderValue = remainder === 'Yes' ? 'Yes' : 'No'; // Store as 'Yes' or 'No'

    // SQL query to update the lead details in the following_leads table
    const sql = `
      UPDATE following_leads 
      SET 
        call_Attended = ?, 
        Call_Discussion = ?, 
        remember = ?, 
        reminder_date = ?, 
        updated_at = NOW()
      WHERE 
        follow_id = ?
    `;

    // Execute the query
    db.query(sql, [callStatus, callDiscussion, remainderValue, reminderDate, follow_id], (err, result) => {
      if (err) {
        console.error('Error updating the lead:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      return res.status(200).json({ message: 'Lead updated successfully' });
    });
  });





  router.post('/enterLeave', (req, res) => {
    const { leave_date, reason } = req.body;
    const query = `INSERT INTO admin_leave (leave_date, reason) VALUES (?, ?)`;
    db.query(query, [leave_date, reason], (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).send('Leave entered successfully');
    });
  });

  // Get all admin leave entries (for calendar display)
  router.get('/adminLeave', (req, res) => {
    const query = `SELECT * FROM admin_leave`;
    db.query(query, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  });

  return router;
}