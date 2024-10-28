const express = require('express');
const router = express.Router();
const moment = require('moment');

module.exports = (db, storage) => {


    router.get('/salesReport', (req, res) => {
        try {
            const getData = `
                SELECT 
                    inv.id,
                    inv.invoice_number,
                    inv.leads_name,
                    inv.invoice_date,
                    pro.pro_name,
                    product.quantity,
                    product.price,
                    (product.price * product.quantity) AS total_price_per_product
                FROM 
                    invoicehistory inv
                JOIN 
                    JSON_TABLE(inv.product_details, '$[*]' COLUMNS (
                        pro_id INT PATH '$.pro_id',
                        price DECIMAL(10,2) PATH '$.price',
                        quantity INT PATH '$.quantity'
                    )) AS product ON product.pro_id IN (SELECT pro_id FROM products)
                LEFT JOIN 
                    products pro ON product.pro_id = pro.pro_id
            `;

            db.query(getData, (getErr, getRes) => {
                if (getErr) {
                    console.error("Error fetching sales data:", getErr); // Log the actual error
                    return res.status(500).json({ message: "Internal server error. Could not fetch sales data." });
                } else if (getRes.length === 0) {
                    return res.status(404).json({ message: "Sales Data Not Found" });
                } else {
                    return res.status(200).json(getRes);
                }
            });
        } catch (error) {
            console.error("Error processing request:", error);
            return res.status(500).json({ message: "Internal server error." });
        }
    });


    return router;
}
