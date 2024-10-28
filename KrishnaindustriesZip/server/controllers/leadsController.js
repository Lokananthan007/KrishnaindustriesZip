const express = require('express');
const router = express.Router();
const moment = require('moment');
const axios = require('axios');


module.exports = (db) => {



    router.get('/getleads', async (req, res) => {
        try {
            const query = 'SELECT * FROM leads_data'; // Modify to match your table structure
            db.query(query, (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error fetching leads data', error: err });
                }
                res.json({ data: results });
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    });

    router.post('/following-leads', (req, res) => {
        const {
            emp_id, leads_id, leads_name, leads_mobile, leads_email, leads_company, leads_address,
            leads_state, leads_city, product_name, Call_Discussion, call_Attended, remember, reminder_date,
            Description
        } = req.body;

        // Helper function to convert empty strings to null
        const setEmptyStringToNull = (value) => (value === '' ? null : value);

        // Apply the helper function to each field that could be empty
        const formattedData = {
            emp_id: setEmptyStringToNull(emp_id),
            leads_id: setEmptyStringToNull(leads_id),
            leads_name: setEmptyStringToNull(leads_name),
            leads_mobile: setEmptyStringToNull(leads_mobile),
            leads_email: setEmptyStringToNull(leads_email),
            leads_company: setEmptyStringToNull(leads_company),
            leads_address: setEmptyStringToNull(leads_address),
            leads_state: setEmptyStringToNull(leads_state),
            leads_city: setEmptyStringToNull(leads_city),
            product_name: setEmptyStringToNull(product_name),
            Call_Discussion: setEmptyStringToNull(Call_Discussion),
            call_Attended: setEmptyStringToNull(call_Attended),
            remember: setEmptyStringToNull(remember),
            reminder_date: setEmptyStringToNull(reminder_date), // Handle reminder_date as well
            Description: setEmptyStringToNull(Description)
        };

        const sql = `INSERT INTO following_leads (
          emp_id, leads_id, leads_name, leads_mobile, leads_email, product_name, leads_company,
          leads_address, leads_state, leads_city, Call_Discussion, call_Attended, remember, reminder_date, Description, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

        db.query(sql, [
            formattedData.emp_id, formattedData.leads_id, formattedData.leads_name, formattedData.leads_mobile,
            formattedData.leads_email, formattedData.product_name, formattedData.leads_company, formattedData.leads_address,
            formattedData.leads_state, formattedData.leads_city, formattedData.Call_Discussion, formattedData.call_Attended,
            formattedData.remember, formattedData.reminder_date, formattedData.Description
        ], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error saving lead data' });
            }
            res.status(200).json({ message: 'Lead data saved successfully' });
        });
    });

    // =======================================================================================================================

    router.get('/getFollowingLeadsMobile', (req, res) => {
        db.query(`SELECT * FROM following_leads`, (err, results) => {
            if (err) {
                console.error('Error fetching following leads:', err);
                return res.status(500).json({ message: 'Error fetching following leads' });
            }

            // Send results to the frontend
            res.json(results);
        });
    });
    // ======================================================================================

    // Fetch indiamart all leads
    router.get('/api/leads-and-following', async (req, res) => {
        const { date, month } = req.query;
        let leadsQuery = 'SELECT * FROM leads_data';

        // Apply filtering based on query parameters
        if (date) {
            leadsQuery += ` WHERE DATE(QUERY_TIME) = '${date}'`;
        } else if (month) {
            const [year, monthNumber] = month.split('-');
            leadsQuery += ` WHERE YEAR(QUERY_TIME) = ${year} AND MONTH(QUERY_TIME) = ${monthNumber}`;
        }

        try {
            // Execute the leads query
            const leadsResults = await new Promise((resolve, reject) => {
                db.query(leadsQuery, (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
            });

            // Execute the following leads query
            const followingLeadsResults = await new Promise((resolve, reject) => {
                db.query('SELECT * FROM following_leads', (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
            });

            // Send the combined results
            res.json({ leads: leadsResults, followingLeads: followingLeadsResults });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching data', error });
        }
    });
    // ====================================================================================
    // Fetch indiamart all leads
    router.get('/walking-leads', async (req, res) => {

        const query = 'SELECT * FROM walking_leads';

        db.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to fetch leads' });
            }
            res.status(200).json(results);
        });
    });


    // ==================================================================

    router.get('/followingLeadsByEmpId', (req, res) => {
        const { emp_id, reminderDate, startDate, endDate, state, city } = req.query;
        let query = `SELECT leads.*, emp.emp_name 
        FROM following_leads leads 
        INNER JOIN employee emp 
        ON emp.emp_id = leads.emp_id
        WHERE leads.emp_id = ${emp_id} AND leads.call_Attended =  'Attended'`;


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


    // ======================================================

    router.get('/empFollowLeadsForAdmin', (req, res) => {
        const { reminderDate, startDate, endDate, state, city, emp_id } = req.query;
        let query = `SELECT leads.*, emp.emp_name 
                     FROM following_leads leads 
                     INNER JOIN employee emp 
                     ON emp.emp_id = leads.emp_id`;

        if (emp_id && emp_id != 'null') {
            query += ` WHERE leads.emp_id = '${emp_id}'`;
        }

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
                console.log("Error :", getErr);
                res.status(500).json({ message: "Internal Server Error. Could not fetch Employee Following Leads." });
            } else {
                res.status(200).json(getRes);
                // console.log("Data :", getRes);
            }
        });
    });

    // =====================================================================================
    router.put('/updateFlwLeadForEmp/:id', (req, res) => {
        try {
            const follow_id = req.params.id;
            const {
                leads_name,
                leads_mobile,
                leads_email,
                leads_company,
                leads_address,
                leads_state,
                leads_city,
                product_name,
                Call_Discussion,
                remember,
                reminder_date,
                gst_number,
                billing_address,
                shipping_address
            } = req.body;

            // Convert reminder_date to 'YYYY-MM-DD' format
            const formattedReminderDate = reminder_date ? moment(reminder_date).format('YYYY-MM-DD') : null;

            // Extract fields from billing_address and shipping_address
            const {
                door_number: billing_door_number,
                street: billing_street,
                landMark: billing_landMark,
                city: billing_city,
                state: billing_state,
                pincode: billing_pincode
            } = billing_address || {};

            const {
                door_number: shipping_door_number,
                street: shipping_street,
                landMark: shipping_landMark,
                city: shipping_city,
                state: shipping_state,
                pincode: shipping_pincode
            } = shipping_address || {};

            const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

            const updateLeads = `
                UPDATE following_leads
                SET
                    leads_name = ?,
                    leads_mobile = ?,
                    leads_email = ?,
                    leads_company = ?,
                    leads_address = ?,
                    leads_state = ?,
                    leads_city = ?,
                    product_name = ?,
                    Call_Discussion = ?,
                    remember = ?,
                    reminder_date = ?,           
                    gst_number = ?,             
                    billing_door_number = ?,     
                    billing_street = ?,
                    billing_landMark = ?,        
                    billing_city = ?,
                    billing_state = ?,
                    billing_pincode = ?,
                    shipping_door_number = ?,    
                    shipping_street = ?,
                    shipping_landMark = ?,       
                    shipping_city = ?,
                    shipping_state = ?,
                    shipping_pincode = ?,
                    updated_at = ?
                WHERE
                    follow_id = ?
            `;

            const params = [
                leads_name ?? null,
                leads_mobile ?? null,
                leads_email ?? null,
                leads_company ?? null,
                leads_address ?? null,
                leads_state ?? null,
                leads_city ?? null,
                product_name ?? null,
                Call_Discussion ?? null,
                remember ?? null,
                formattedReminderDate ?? null,
                gst_number ?? null,
                billing_door_number ?? null,
                billing_street ?? null,
                billing_landMark ?? null,
                billing_city ?? null,
                billing_state ?? null,
                billing_pincode ?? null,
                shipping_door_number ?? null,
                shipping_street ?? null,
                shipping_landMark ?? null,
                shipping_city ?? null,
                shipping_state ?? null,
                shipping_pincode ?? null,
                currentDate,
                follow_id
            ];

            // Log the SQL query and parameters for debugging
            // console.log('Executing SQL query:', updateLeads);
            // console.log('With parameters:', params);

            db.query(updateLeads, params, (updateErr, updateRes) => {
                if (updateErr) {
                    console.log("Error during SQL execution:", updateErr);
                    res.status(500).json({ message: "Internal server error." });
                } else {
                    if (updateRes.affectedRows > 0) {
                        res.status(200).json({ message: "Leads data updated successfully." });
                    } else {
                        res.status(404).json({ message: "No lead found with the given ID." });
                    }
                }
            });
        } catch (error) {
            console.log("Error in the try-catch block:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });


    router.get('/quotation/:follow_id', async (req, res) => {
        console.log("quotationssss");

        const { follow_id } = req.params;

        const query = `
        SELECT 
          follow_id, emp_id, leads_id, leads_name, leads_mobile, leads_email, product_name,
          leads_company, leads_address, leads_state, leads_city, Call_Discussion, remember, 
          reminder_date, Description, call_Attended, created_at, updated_at, gst_number,
          billing_door_number, billing_street, billing_landMark, billing_city, billing_state, 
          billing_pincode, shipping_door_number, shipping_street, shipping_landMark, shipping_city,
          shipping_state, shipping_pincode
        FROM following_leads 
        WHERE follow_id = ?
      `;

        db.query(query, [follow_id], (err, results) => {
            if (err) {
                console.error('Error fetching lead by follow_id: ', err);
                return res.status(500).json({ message: "Internal server error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Lead not found" });
            }

            const leadData = results[0];

            // Combine billing and shipping addresses into objects
            leadData.billing_address = {
                door_number: leadData.billing_door_number,
                street: leadData.billing_street,
                landMark: leadData.billing_landMark,
                city: leadData.billing_city,
                state: leadData.billing_state,
                pincode: leadData.billing_pincode
            };

            leadData.shipping_address = {
                door_number: leadData.shipping_door_number,
                street: leadData.shipping_street,
                landMark: leadData.shipping_landMark,
                city: leadData.shipping_city,
                state: leadData.shipping_state,
                pincode: leadData.shipping_pincode
            };

            // Return the lead data with all fields, including address objects
            res.status(200).json(leadData);
        });
    });



    router.get('/leadsCountForDashboard', (req, res) => {
        const currentDate = moment().format("YYYY-MM-DD");
        // console.log(currentDate);
        const getData = `
            SELECT COUNT(CASE WHEN reminder_date = '${currentDate}' THEN 1 END) AS reminder_date_count,
                   COUNT(CASE WHEN DATE(created_at) = '${currentDate}' THEN 1 END) AS created_at_count,
                   GROUP_CONCAT(DISTINCT CONCAT(emp_id, ':', leads_name, ':', leads_mobile) SEPARATOR '; ') AS leads_details
            FROM following_leads
            WHERE DATE(created_at) = '${currentDate}'`;
        db.query(getData, (getErr, getRes) => {
            if (getErr) {
                res.status(500).json({ message: "Internal server error." });
            } else if (getRes.length === 0) {
                res.status(404).json({ message: "Data not found." });
            } else {
                res.status(200).json(getRes[0]);
            }
        });
    });


    // Endpoint to get all employees
    router.get('/emplyees', (req, res) => {
        console.log("Fetching employees");
        const query = 'SELECT emp_id, emp_name FROM employee WHERE is_active = 1'; // Optionally filter by active employees

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Internal server error." });
            }
            res.status(200).json(results);
        });
    });




    // =================================================================================


    router.get('/leadsCountForEmpDashboard/:empId', (req, res) => {
        const empId = req.params.empId;
        const currentDate = moment().format("YYYY-MM-DD");
        const getData = `
        SELECT 
            COUNT(CASE WHEN reminder_date = '${currentDate}' THEN 1 END) AS reminder_date_count,
            COUNT(CASE WHEN DATE(created_at) = '${currentDate}' THEN 1 END) AS created_at_count 
        FROM 
            following_leads
        WHERE 
            emp_id = '${empId}'`;

        db.query(getData, (getErr, getRes) => {
            if (getErr) {
                res.status(500).json({ message: "Internal server error." });
            } else if (getRes.length === 0) {
                res.status(404).json({ message: "Data not found." });
            } else {
                res.status(200).json(getRes[0]);
            }
        });
    });

    // Endpoint to fetch detailed lead data for today
    router.get('/todayFollowLeadsDetails/:empId', (req, res) => {
        const empId = req.params.empId;
        const currentDate = moment().format("YYYY-MM-DD");
        const getDetails = `
        SELECT leads_name, leads_mobile, leads_email, product_name
        FROM following_leads
        WHERE emp_id = '${empId}' AND DATE(created_at) = '${currentDate}'`;

        db.query(getDetails, (error, results) => {
            if (error) {
                console.error('Error executing query:', error);
                res.status(500).send('Error fetching data');
            } else {
                res.status(200).json(results);
            }
        });
    });


    router.get('/callNotAttended', (req, res) => {
        // console.log("rrrr");
        const getData = `SELECT * FROM following_leads WHERE call_Attended = 'Not Attended'`;
        db.query(getData, (getErr, getRes) => {
            if (getErr) {
                res.status(500).json({ message: "Internal server error." });
            } else if (getRes.length === 0) {
                res.status(404).json({ message: "Data not found." });
            } else {
                res.status(200).json(getRes); // Return the full array
            }
        });
    });
    router.get('/callNotAttendedDashBoard', (req, res) => {
        const currentDate = moment().format("YYYY-MM-DD"); // Get the current date in YYYY-MM-DD format

        // Query to count the leads where call_Attended is 'no' for today
        const getCountQuery = `
            SELECT COUNT(*) AS count 
            FROM following_leads 
            WHERE call_Attended = 'Not Attended' AND DATE(created_at) = '${currentDate}'
        `;

        // Query to get the details of leads where call_Attended is 'no' for today
        const getDetailsQuery = `
            SELECT * 
            FROM following_leads 
            WHERE call_Attended = 'Not Attended' AND DATE(created_at) = '${currentDate}'
        `;

        // Execute count query
        db.query(getCountQuery, (countErr, countRes) => {
            if (countErr) {
                res.status(500).json({ message: "Internal server error." });
            } else {
                const count = countRes[0].count;

                // Execute details query
                db.query(getDetailsQuery, (detailsErr, detailsRes) => {
                    if (detailsErr) {
                        res.status(500).json({ message: "Internal server error." });
                    } else {
                        // Send the response with count and details
                        res.status(200).json({ count, details: detailsRes });
                    }
                });
            }
        });
    });


    const generateWakingLeadsId = (callback) => {
        const query = `SELECT MAX(leads_id) AS maxId FROM following_leads WHERE leads_id LIKE 'WLEAD%'`;
        db.query(query, (err, results) => {
            if (err) throw err;

            let newId;
            if (results[0].maxId) {
                // Extract numeric part from the current maxId
                const currentId = results[0].maxId;
                const numericPart = parseInt(currentId.replace('WLEAD', ''), 10); // Get the numeric part
                newId = `WLEAD${String(numericPart + 1).padStart(5, '0')}`; // Increment and format the new ID
            } else {
                newId = `WLEAD00001`; // Starting ID if there are no leads
            }
            callback(newId);
        });
    };



    // Route to add new waking lead
    router.post('/waking-leads/create', (req, res) => {
        const {
            emp_id,
            leads_name,
            leads_mobile,
            leads_email,
            leads_company,
            leads_address,
            leads_state,
            leads_city,
            call_Attended,
            Call_Discussion,
            remember,
            reminder_date,
            gst_number,
            billing_address,
            shipping_address
        } = req.body;

        generateWakingLeadsId((leads_id) => {
            // Function to convert empty strings to null
            const setEmptyStringToNull = (value) => (value === '' ? null : value);

            // Insert into following_leads
            const followingLeadsQuery = `
            INSERT INTO following_leads (
              leads_id, emp_id, leads_name, leads_mobile, leads_email, leads_company, leads_address, leads_state, leads_city,
              call_Attended, Call_Discussion, remember, reminder_date, gst_number, billing_door_number, billing_street, billing_landMark,
              billing_city, billing_state, billing_pincode, shipping_door_number, shipping_street, shipping_landMark,
              shipping_city, shipping_state, shipping_pincode, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

            const followingLeadsValues = [
                leads_id,
                emp_id,
                setEmptyStringToNull(leads_name),
                setEmptyStringToNull(leads_mobile),
                setEmptyStringToNull(leads_email),
                setEmptyStringToNull(leads_company),
                setEmptyStringToNull(leads_address),
                setEmptyStringToNull(leads_state),
                setEmptyStringToNull(leads_city),
                setEmptyStringToNull(call_Attended),
                setEmptyStringToNull(Call_Discussion),
                setEmptyStringToNull(remember),
                setEmptyStringToNull(reminder_date),
                setEmptyStringToNull(gst_number),
                setEmptyStringToNull(billing_address.door_number),
                setEmptyStringToNull(billing_address.street),
                setEmptyStringToNull(billing_address.landMark),
                setEmptyStringToNull(billing_address.city),
                setEmptyStringToNull(billing_address.state),
                setEmptyStringToNull(billing_address.pincode),
                setEmptyStringToNull(shipping_address.door_number),
                setEmptyStringToNull(shipping_address.street),
                setEmptyStringToNull(shipping_address.landMark),
                setEmptyStringToNull(shipping_address.city),
                setEmptyStringToNull(shipping_address.state),
                setEmptyStringToNull(shipping_address.pincode),
            ];

            db.query(followingLeadsQuery, followingLeadsValues, (err, result) => {
                if (err) {
                    console.error('Error inserting new following lead:', err);
                    return res.status(500).json({ message: 'Failed to create new following lead.' });
                }

                // Insert into walking_leads
                const walkingLeadsQuery = `
                INSERT INTO walking_leads (
                    leads_id, emp_id, leads_name, leads_mobile, leads_email, leads_company, leads_address, leads_state, leads_city,
                    call_Attended, Call_Discussion, remember, reminder_date, gst_number, billing_door_number, billing_street, billing_landMark,
                    billing_city, billing_state, billing_pincode, shipping_door_number, shipping_street, shipping_landMark,
                    shipping_city, shipping_state, shipping_pincode, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `;

                const walkingLeadsValues = [
                    leads_id,
                    emp_id,
                    setEmptyStringToNull(leads_name),
                    setEmptyStringToNull(leads_mobile),
                    setEmptyStringToNull(leads_email),
                    setEmptyStringToNull(leads_company),
                    setEmptyStringToNull(leads_address),
                    setEmptyStringToNull(leads_state),
                    setEmptyStringToNull(leads_city),
                    setEmptyStringToNull(call_Attended),
                    setEmptyStringToNull(Call_Discussion),
                    setEmptyStringToNull(remember),
                    setEmptyStringToNull(reminder_date),
                    setEmptyStringToNull(gst_number),
                    setEmptyStringToNull(billing_address.door_number),
                    setEmptyStringToNull(billing_address.street),
                    setEmptyStringToNull(billing_address.landMark),
                    setEmptyStringToNull(billing_address.city),
                    setEmptyStringToNull(billing_address.state),
                    setEmptyStringToNull(billing_address.pincode),
                    setEmptyStringToNull(shipping_address.door_number),
                    setEmptyStringToNull(shipping_address.street),
                    setEmptyStringToNull(shipping_address.landMark),
                    setEmptyStringToNull(shipping_address.city),
                    setEmptyStringToNull(shipping_address.state),
                    setEmptyStringToNull(shipping_address.pincode),
                ];

                db.query(walkingLeadsQuery, walkingLeadsValues, (err) => {
                    if (err) {
                        console.error('Error inserting new walking lead:', err);
                        return res.status(500).json({ message: 'Failed to create new walking lead.' });
                    }

                    res.status(200).json({
                        message: 'New waking lead created successfully',
                        leads_id
                    });
                });
            });
        });
    });

    router.get('/api/leads-data', async (req, res) => {
        const { selectedDate, selectedMonth } = req.query;

        try {
            let query = 'SELECT * FROM leads_data';
            const queryParams = [];

            // If selectedDate is provided, filter by that date
            if (selectedDate) {
                query += ' WHERE DATE(QUERY_TIME) = ?';
                queryParams.push(selectedDate);
            }

            // If selectedMonth is provided, filter by that month
            else if (selectedMonth) {
                const [year, month] = selectedMonth.split('-');
                query += ' WHERE YEAR(QUERY_TIME) = ? AND MONTH(QUERY_TIME) = ?';
                queryParams.push(year, month);
            }

            // Execute the query
            db.query(query, queryParams, (error, results) => {
                if (error) {
                    console.error('Error fetching leads data:', error.message);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                res.json(results);
            });
        } catch (error) {
            console.error('Error in leads controller:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });



    return router;
}




