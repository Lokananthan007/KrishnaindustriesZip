const express = require('express');
const router = express.Router();
const moment = require('moment');

module.exports = (db) => {
    router.post('/convertCustomer', (req, res) => {
        console.log("succc");
        try {
            const { emp_id, cust_name, cust_mobile, cust_email, cust_company, cust_address, cust_state, cust_city } = req.body;
            const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
            const insertCustomer = `INSERT INTO customers(emp_id, cust_name, cust_mobile, cust_email, cust_company, cust_address, cust_state, cust_city, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            db.query(insertCustomer, [
                emp_id ?? null,
                cust_name ?? null,
                cust_mobile ?? null,
                cust_email ?? null,
                cust_company ?? null,
                cust_address ?? null,
                cust_state ?? null,
                cust_city ?? null,
                currentDate ?? null,
            ], (insertErr, insertRes) => {
                if (insertErr) {
                    console.error("Error saving leads data:", insertErr);
                    res.status(500).json({ message: "Internal server error." });
                } else {
                    console.log("convert customer data added successfully.");
                    res.status(200).json({ message: "Customer data added successfully." });
                }
            });
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    });

    router.get('/getCustomer', (req, res) => {
        try {
            const getCustomer = 'select * from customer';
            db.query(getCustomer, (getErr, getRes) => {
                if (getErr) {
                    res.status(500).json({ message: "Internal server error." })
                } else if (getRes.length === 0) {
                    res.status(404).json({ message: "Customers Data not found." })
                } else {
                    res.status(200).json(getRes)
                }
            })
        } catch (error) {
            res.status(500).json({ message: "Internal server error." })
        }

    })


    router.get('/getCustomerForAdmin', (req, res) => {
        try {
            const getCustomer = 'select cust.*,emp.emp_name from customes cust inner join employee emp on cust.emp_id = emp.emp_id';
            db.query(getCustomer, (getErr, getRes) => {
                if (getErr) {
                    res.status(500).json({ message: "Internal server error." })
                } else if (getRes.length === 0) {
                    res.status(404).json({ message: "Customers Data not found." })
                } else {
                    res.status(200).json(getRes)
                }
            })
        } catch (error) {
            res.status(500).json({ message: "Internal server error." })
        }

    })

    router.get('/getCustomerByEmpId/:emp_id', (req, res) => {
        try {
            const emp_id = req.params.emp_id;
            const getCustomer = 'select cust.*,emp.emp_name from customer cust inner join employee emp on cust.emp_id = emp.emp_id where cust.emp_id =?';
            db.query(getCustomer, [emp_id], (getErr, getRes) => {
                if (getErr) {
                    res.status(500).json({ message: "Internal server error." })
                } else if (getRes.length === 0) {
                    res.status(404).json({ message: "Customers Data not found." })
                } else {
                    res.status(200).json(getRes)
                }
            })
        } catch (error) {
            res.status(500).json({ message: "Internal server error." })
        }

    })

    router.put('/update/:cust_id', (req, res) => {
        try {
            const cust_id = req.params.cust_id;
            const { cust_name, cust_mobile, cust_email, cust_company, cust_address, cust_state, cust_city } = req.body;
            const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
            const updateCust = `update customers set cust_name = ?, cust_mobile = ?, cust_email = ?, cust_company = ?, cust_address = ?, cust_state = ?, cust_city = ?,updated_at = ? where cust_id =?`;
            db.query(updateCust, [
                cust_name ?? null,
                cust_mobile ?? null,
                cust_email ?? null,
                cust_company ?? null,
                cust_address ?? null,
                cust_state ?? null,
                cust_city ?? null,
                currentDate ?? null,
                cust_id
            ], (updateErr, updateRes) => {
                if (updateErr) {
                    res.status(500).json({ message: "Internal server error." })
                } else {
                    res.status(200).json({ message: "Customer data updated successfully." })
                }
            })

        } catch (error) {
            res.status(500).json({ message: "Internal server error." })
        }
    })

    router.delete('/delete/:cust_id', (req, res) => {
        try {
            const cust_id = req.params.cust_id;
            const dltCust = 'delete from customers where cust_id =?';
            db.query(dltCust, [cust_id], (dltErr, dltRes) => {
                if (dltErr) {
                    res.status(500).json({ message: "Internal server error." })
                } else {
                    res.status(200).json({ message: "Customer deleted successfully." })
                }
            })
        } catch (error) {
            res.status(500).json({ message: "Internal server error." })
        }
    })
    // ===============================================================================================================

    router.get('/CustomerLeadsByEmpId', (req, res) => {
        const { emp_id, reminderDate, startDate, endDate, state, city } = req.query;
        let query = `SELECT leads.*, emp.emp_name 
        FROM customer leads 
        INNER JOIN employee emp 
        ON emp.emp_id = leads.emp_id
        WHERE leads.emp_id = ${emp_id}`;


        if (reminderDate != 'null' && reminderDate !== undefined) {
            query += ` AND leads.reminder_date = '${reminderDate}'`;
        }

        if (startDate && endDate && endDate != 'null') {
            query += ` AND leads.created_at BETWEEN '${startDate}' AND '${endDate}'`;
        } else if (startDate && startDate != 'null') {
            const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
            query += ` AND leads.created_at BETWEEN '${startDate}' AND '${currentDate}'`;
        }

        if (state && state != 'null') {
            query += ` AND leads.leads_state = '${state}'`;
        }

        if (city && city != 'null') {
            query += ` AND leads.leads_city = '${city}'`;
        }

        query += " ORDER BY leads.follow_id DESC";

        // console.log("Query:", query);

        db.query(query, (getErr, getRes) => {
            if (getErr) {
                res.status(500).json({ message: "Internal Server Error. Could not fetch Employee Following Leads." });
                console.log("Error :", getErr)
            } else {
                res.status(200).json(getRes);
                console.log("Data :", getRes)
            }
        });
    });




    router.get('/CustomerLeadsByAdmin', (req, res) => {
        const { reminderDate, startDate, endDate, state, city } = req.query;
        let query = `SELECT leads.*, emp.emp_name 
        FROM customer leads 
        INNER JOIN employee emp 
        ON emp.emp_id = leads.emp_id `;


        if (reminderDate != 'null' && reminderDate !== undefined) {
            query += ` AND leads.reminder_date = '${reminderDate}'`;
        }

        if (startDate && endDate && endDate != 'null') {
            query += ` AND leads.created_at BETWEEN '${startDate}' AND '${endDate}'`;
        } else if (startDate && startDate != 'null') {
            const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
            query += ` AND leads.created_at BETWEEN '${startDate}' AND '${currentDate}'`;
        }

        if (state && state != 'null') {
            query += ` AND leads.leads_state = '${state}'`;
        }

        if (city && city != 'null') {
            query += ` AND leads.leads_city = '${city}'`;
        }

        query += " ORDER BY leads.follow_id DESC";

        // console.log("Query:", query);

        db.query(query, (getErr, getRes) => {
            if (getErr) {
                res.status(500).json({ message: "Internal Server Error. Could not fetch Employee Following Leads." });
                console.log("Error :", getErr)
            } else {
                res.status(200).json(getRes);
                // console.log("Data :", getRes)
            }
        });
    });


    return router;
}