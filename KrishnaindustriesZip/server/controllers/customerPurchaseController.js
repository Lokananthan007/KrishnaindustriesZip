const express = require('express');
const router = express.Router();
const moment = require('moment');

module.exports = (db) => {

    // ====================================================================================================



    router.get('/getCustomerInvoices/:emp_id', (req, res) => {
        const emp_id = req.params.emp_id;

        // Query to get customer and invoice data using emp_id
        const query = `
        SELECT 
            c.customer_id, 
            c.follow_id, 
            c.emp_id, 
            c.leads_id, 
            c.leads_name, 
            c.leads_mobile, 
            c.leads_email, 
            c.product_name, 
            c.leads_company, 
            c.leads_address, 
            c.leads_state, 
            c.leads_city, 
            c.Call_Discussion, 
            c.remember, 
            c.reminder_date, 
            c.Description, 
            c.call_Attended, 
            c.created_at, 
            c.updated_at, 
            c.gst_number, 
            c.billing_door_number, 
            c.billing_street, 
            c.billing_landMark, 
            c.billing_city, 
            c.billing_state, 
            c.billing_pincode, 
            c.shipping_door_number, 
            c.shipping_street, 
            c.shipping_landMark, 
            c.shipping_city, 
            c.shipping_state, 
            c.shipping_pincode, 
            ih.invoice_number, 
            ih.product_details, 
            ih.discount, 
            ih.gst, 
            ih.total_without_tax, 
            ih.total_with_tax, 
            ih.transactionId,
            ih.payment_type, 
            ih.invoice_date
        FROM customer AS c
        LEFT JOIN invoicehistory AS ih ON c.leads_id = ih.leads_id
        WHERE c.emp_id = ?
    `;

        db.query(query, [emp_id], (err, result) => {
            if (err) {
                console.error('Error fetching customer and invoice data:', err);
                return res.status(500).json({ message: 'Internal server error.' });
            }

            // Send the result back to the frontend
            res.json(result);
        });
    });




    router.post('/addDelivery', (req, res) => {
        const { invoiceNumber, courierName, deliveryCode, deliveryStatus } = req.body;

        // Validate the input
        if (!invoiceNumber || !courierName || !deliveryCode || !deliveryStatus) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Get current timestamp
        const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

        // Check if the invoice number already exists in the Delivery table
        const checkQuery = 'SELECT * FROM delivery WHERE invoice_number = ?';
        db.query(checkQuery, [invoiceNumber], (checkError, checkResults) => {
            if (checkError) {
                console.error('Database error:', checkError);
                return res.status(500).json({ message: 'Error checking existing delivery record', error: checkError });
            }

            if (checkResults.length > 0) {
                // If the invoice number exists, update the delivery details
                const updateValues = [courierName, deliveryCode, deliveryStatus, invoiceNumber];

                // Prepare query to update delivery details with timestamps
                let updateQuery = `
                    UPDATE Delivery 
                    SET courier_name = ?, delivery_code = ?, delivery_status = ?, delivery_date_time = ?
                    WHERE invoice_number = ?`;

                // Update delivery_date_time if status is "Shipped"
                if (deliveryStatus === 'Shipped') {
                    updateValues.splice(3, 0, currentTime); // Add currentTime to updateValues
                } else {
                    updateValues.splice(3, 0, null); // Set delivery_date_time to null if not "Shipped"
                }

                // If status is "Delivered", set delivered_date_time
                if (deliveryStatus === 'Delivered') {
                    updateQuery = `
                        UPDATE Delivery 
                        SET courier_name = ?, delivery_code = ?, delivery_status = ?, delivery_date_time = ?, delivered_date_time = ?
                        WHERE invoice_number = ?`;
                    updateValues.splice(4, 0, currentTime); // Add currentTime for delivered_date_time
                }

                db.query(updateQuery, updateValues, (updateError, updateResults) => {
                    if (updateError) {
                        console.error('Database error during update:', updateError);
                        return res.status(500).json({ message: 'Error updating delivery record', error: updateError });
                    }
                    res.status(200).json({ message: 'Delivery record updated successfully' });
                });
            } else {
                // If the invoice number does not exist, insert a new record
                const insertQuery = `
                    INSERT INTO Delivery (invoice_number, courier_name, delivery_code, delivery_status, delivery_date_time, delivered_date_time) 
                    VALUES (?, ?, ?, ?, ?, ?)`;
                const insertValues = [invoiceNumber, courierName, deliveryCode, deliveryStatus, null, null]; // Set dates to null initially

                // Set delivery_date_time or delivered_date_time if needed
                if (deliveryStatus === 'Shipped') {
                    insertValues[4] = currentTime; // Set delivery_date_time for "Shipped"
                } else if (deliveryStatus === 'Delivered') {
                    insertValues[5] = currentTime; // Set delivered_date_time for "Delivered"
                }

                db.query(insertQuery, insertValues, (insertError, insertResults) => {
                    if (insertError) {
                        console.error('Database error during insert:', insertError);
                        return res.status(500).json({ message: 'Error adding delivery record', error: insertError });
                    }
                    res.status(201).json({ message: 'Delivery record added successfully', deliveryId: insertResults.insertId });
                });
            }
        });
    });


    // Route to get all delivery records
    router.get('/getAllDeliveries', (req, res) => {
        const query = 'SELECT * FROM delivery';
        db.query(query, (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ message: 'Error fetching delivery records', error });
            }

            res.status(200).json(results); // Return all delivery records
        });
    });





    // ============================================

    router.get('/getCustomerInvoices', (req, res) => {
        const query = `
   SELECT 
    c.customer_id, 
    c.follow_id, 
    c.emp_id, 
    e.emp_name, -- Fetch the employee name
    c.leads_id, 
    c.leads_name, 
    c.leads_mobile, 
    c.leads_email, 
    c.product_name, 
    c.leads_company, 
    c.leads_address, 
    c.leads_state, 
    c.leads_city, 
    c.Call_Discussion, 
    c.remember, 
    c.reminder_date, 
    c.Description, 
    c.call_Attended, 
    c.created_at, 
    c.updated_at, 
    c.gst_number, 
    c.billing_door_number, 
    c.billing_street, 
    c.billing_landMark, 
    c.billing_city, 
    c.billing_state, 
    c.billing_pincode, 
    c.shipping_door_number, 
    c.shipping_street, 
    c.shipping_landMark, 
    c.shipping_city, 
    c.shipping_state, 
    c.shipping_pincode, 
    ih.invoice_number, 
    ih.product_details, 
    ih.discount, 
    ih.gst, 
    ih.total_without_tax, 
    ih.total_with_tax, 
    ih.transactionId, 
    ih.payment_type, 
    ih.invoice_date
FROM customer AS c
LEFT JOIN invoicehistory AS ih ON c.leads_id = ih.leads_id
LEFT JOIN employee AS e ON c.emp_id = e.emp_id -- Join employee table to get emp_name

`;

        db.query(query, (err, result) => {
            if (err) {
                console.error('Error fetching customer and invoice data:', err);
                return res.status(500).json({ message: 'Internal server error.' });
            }

            // Send the result back to the frontend
            res.json(result);
        });
    });





    return router;
}
