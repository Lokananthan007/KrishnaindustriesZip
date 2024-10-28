const express = require('express');
const router = express.Router();
const moment = require('moment');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

module.exports = (db) => {

  // Get all purchase data
  router.get('/getPurchase', (req, res) => {
    const getData = 'SELECT * FROM purchase';
    db.query(getData, (getErr, getRes) => {
      if (getErr) {
        res.status(500).json({ message: "Internal server error. Could not fetch purchase data." });
      } else if (getRes.length === 0) {
        res.status(404).json({ message: "Purchase data not found." });
      } else {
        res.status(200).json(getRes);
      }
    });
  });
  router.post('/savePurchase', (req, res) => {
    const { pro_name, specification, purch_address, quantity, price, total, gst } = req.body;
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const saveData = 'insert into purchase(pro_name,specification,purch_address,quantity,price,total,gst,created_at) values(?,?,?,?,?,?,?,?)';
    db.query(saveData, [pro_name, specification, purch_address, quantity, price, total, gst, currentDate], (saveErr, saveRes) => {
      if (saveErr) {
        res.status(500).json({ message: "Internal server error." })
        console.log("Error :", saveErr)
      } else {
        res.status(200).json({ message: "Purchase Data added successfully." })
      }
    })
  })


  // Save purchase data from Excel file
  router.post('/savePurchaseexcel', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const filePath = path.resolve(req.file.path);
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const saveData = 'INSERT INTO purchase (pro_name, specification, purch_address, quantity, price, total, gst, created_at) VALUES ?';
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

    const values = data.map(item => [
      item.pro_name,
      item.specification,
      item.purch_address,
      item.quantity,
      item.price,
      item.total,
      item.gst,
      currentDate
    ]);

    db.query(saveData, [values], (saveErr, saveRes) => {
      if (saveErr) {
        res.status(500).json({ message: "Internal server error." });
        console.log("Error:", saveErr);
      } else {
        res.status(200).json({ message: "Purchase data added successfully." });
      }
    });
  });

  // Update purchase data
  router.put('/update/:id', (req, res) => {
    const purch_id = req.params.id;
    const { pro_name, specification, purch_address, quantity, price, total, gst } = req.body;
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const updateData = 'UPDATE purchase SET pro_name = ?, specification = ?, purch_address = ?, quantity = ?, price = ?, total = ?, gst = ?, updated_at = ? WHERE purch_id = ?';
    db.query(updateData, [pro_name, specification, purch_address, quantity, price, total, gst, currentDate, purch_id], (updateErr, updateRes) => {
      if (updateErr) {
        res.status(500).json({ message: "Internal server error." });
        console.log("Error:", updateErr);
      } else {
        res.status(200).json({ message: "Purchase data updated successfully." });
      }
    });
  });

  // Delete purchase data
  router.delete('/delete/:id', (req, res) => {
    const purch_id = req.params.id;
    const dltData = 'DELETE FROM purchase WHERE purch_id = ?';
    db.query(dltData, [purch_id], (dltErr, dltRes) => {
      if (dltErr) {
        res.status(500).json({ message: "Internal server error." });
      } else {
        res.status(200).json({ message: "Purchase data deleted successfully." });
      }
    });
  });





  // =======================================================================================================================================

  router.post('/purchases', (req, res) => {
    const {
      productName,
      productId,
      specification,
      quantity,
      price,
      gst,
      cgst,
      sgst,
      totalPrice,
      totalPriceWithGST,
      fromName,
      address,
      street,
      city,
      state,
      pinCode,
    } = req.body;

    // Insert purchase data into the database
    const query = `
      INSERT INTO purchases (productName,productId, specification, quantity, price, gst, cgst, sgst, totalPrice,totalPriceWithGST, fromName, address, street, city, state, pinCode)
      VALUES (?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      productName,
      productId,
      specification,
      quantity,
      price,
      gst,
      cgst,
      sgst,
      totalPrice,
      totalPriceWithGST,
      fromName,
      address,
      street,
      city,
      state,
      pinCode,
    ];

    db.query(query, values, (error, results) => {
      if (error) {
        console.error('Error inserting purchase data:', error);
        return res.status(500).json({ message: 'Error inserting purchase data' });
      }
      return res.status(200).json({ message: 'Purchase data inserted successfully', purchaseId: results.insertId });
    });
  });

  // Route to get all purchases (if needed)
  router.get('/purchases', (req, res) => {
    const query = 'SELECT * FROM purchases ORDER BY created_at DESC';
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching purchases:', error);
        return res.status(500).json({ message: 'Error fetching purchases' });
      }
      res.json(results);
    });
  });


  router.post('/uploadexclepurchases', (req, res) => {

    const purchasesData = req.body; // This is the array of purchases data from the frontend

    if (!Array.isArray(purchasesData) || purchasesData.length === 0) {
      return res.status(400).json({ error: 'No data to insert' });
    }

    // Prepare the query for inserting data into purchases table
    const query = `
        INSERT INTO purchases 
        (productName, productId, specification, quantity, price, gst, cgst, sgst, totalPrice, totalPriceWithGST, fromName, address, street, city, state, pinCode, created_at, updated_at)
        VALUES ?`;

    const values = purchasesData.map(purchase => [
      purchase.productName,
      purchase.productId,
      purchase.specification,
      purchase.quantity,
      purchase.price,
      purchase.gst,
      purchase.cgst,
      purchase.sgst,
      purchase.totalPrice,
      purchase.totalPriceWithGST,
      purchase.fromName,
      purchase.address,
      purchase.street,
      purchase.city,
      purchase.state,
      purchase.pinCode,
      new Date(),
      new Date()
    ]);

    // Execute the query using the callback style (non-promise)
    db.query(query, [values], (err, result) => {
      if (err) {
        console.error('Error inserting purchases data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Send a success response if the data is inserted successfully
      res.status(200).json({ message: 'Purchases data uploaded successfully!' });
    });
  });
  router.get('/purchases-data', (req, res) => {
    const query = 'SELECT * FROM purchases';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching purchases data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(results); // Return the purchases data to the frontend
    });
  });

  // PUT: Update a purchase by ID
  router.put('/purchases/:id', (req, res) => {
    const purchaseId = req.params.id;
    const {
      productName,
      productId,
      specification,
      quantity,
      price,
      gst,
      cgst,
      sgst,
      totalPrice,
      totalPriceWithGST,
      fromName,
      address,
      street,
      city,
      state,
      pinCode
    } = req.body;

    // Update query to modify an existing purchase
    const updateQuery = `
    UPDATE purchases 
    SET 
      productName = ?, 
      productId = ?, 
      specification = ?, 
      quantity = ?, 
      price = ?, 
      gst = ?, 
      cgst = ?, 
      sgst = ?, 
      totalPrice = ?, 
      totalPriceWithGST = ?, 
      fromName = ?, 
      address = ?, 
      street = ?, 
      city = ?, 
      state = ?, 
      pinCode = ?,
      updated_at = NOW() -- Update the timestamp
    WHERE id = ?
  `;

    // Execute the update query
    db.query(
      updateQuery,
      [
        productName,
        productId,
        specification,
        quantity,
        price,
        gst,
        cgst,
        sgst,
        totalPrice,
        totalPriceWithGST,
        fromName,
        address,
        street,
        city,
        state,
        pinCode,
        purchaseId
      ],
      (err, result) => {
        if (err) {
          console.error('Error updating purchase:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Purchase not found' });
        }

        res.status(200).json({ message: 'Purchase updated successfully!' });
      }
    );
  });

  // DELETE: Remove a purchase by ID
  router.delete('/purchases/:id', (req, res) => {
    const purchaseId = req.params.id;

    // Delete query to remove a purchase
    const deleteQuery = `DELETE FROM purchases WHERE id = ?`;

    // Execute the delete query
    db.query(deleteQuery, [purchaseId], (err, result) => {
      if (err) {
        console.error('Error deleting purchase:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Purchase not found' });
      }

      res.status(200).json({ message: 'Purchase deleted successfully!' });
    });
  });

  return router;
};



