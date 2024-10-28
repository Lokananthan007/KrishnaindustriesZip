const express = require('express');
const router = express.Router();
const moment = require('moment');
const multer = require('multer');



module.exports = (db, storage) => {
    const upload = multer({ storage: storage });

    router.post('/saveProduct', upload.single('pro_img'), (req, res) => {
        try {
            const { pro_name, description } = req.body;
            const pro_img = req.file.filename;
            const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
            const saveQuery = 'INSERT INTO products (pro_name, pro_img,description, created_at) VALUES (?, ?, ?,?)';
            db.query(saveQuery, [pro_name, pro_img, description, currentDate], (saveErr, saveRes) => {
                if (saveErr) {
                    console.error("Error saving product data:", saveErr);
                    res.status(500).json({ message: "Internal server error." });
                } else {
                    res.status(200).json({ message: "Product data stored successfully." });
                }
            });
        } catch (error) {
            console.error("Error processing request:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });


    router.get('/getProductData', (req, res) => {
        try {
            const getData = 'select * from products';
            db.query(getData, (getErr, getRes) => {
                if (getErr) {
                    res.status(500).json({ message: "Internal server error." })
                } else if (getRes.length === 0) {
                    res.status(404).json({ message: "Product Data Not Found" })
                } else {
                    res.status(200).json(getRes);
                }
            })
        } catch (error) {
            console.error("Error processing request:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    })

    router.put('/update/:id', upload.single('pro_img'), (req, res) => {
        try {
            const pro_id = req.params.id;
            const { pro_name, description } = req.body;
            const pro_img = req.file ? req.file.filename : null;
            const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
            let updateData = '';
            let queryParams = [];
            if (pro_img !== null && pro_img !== 'null') {
                updateData = `UPDATE products SET pro_name = ?, pro_img = ?,description=? updated_at = ? WHERE pro_id = ?`;
                queryParams = [pro_name, pro_img, description, currentDate, pro_id];
            } else {
                updateData = `UPDATE products SET pro_name = ?,description=?, updated_at = ? WHERE pro_id = ?`;
                queryParams = [pro_name, description, currentDate, pro_id];
            }
            console.log("Query:", updateData);
            console.log("Query Parameters:", queryParams);
            db.query(updateData, queryParams, (updateErr, updateRes) => {
                if (updateErr) {
                    console.error("ERROR :", updateErr);
                    return res.status(500).json({ message: "Internal server error." });
                }
                res.status(200).json({ message: "Product Data updated successfully." });
            });
        } catch (error) {
            console.error("Error processing request:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });




    router.delete('/delete/:id', (req, res) => {
        try {
            const pro_id = req.params.id;
            const dltData = 'delete from products where pro_id = ?';
            db.query(dltData, [pro_id], (dltErr, dltRes) => {
                if (dltErr) {
                    res.status(500).json({ message: "Internal server error." })
                    console.log("Error :", dltErr)
                } else {
                    res.status(200).json({ message: "Product data deleted successfully." })
                }
            })
        } catch (error) {
            console.error("Error processing request:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    })


    router.post('/saveProSpec', (req, res) => {
        try {
            const { specifications } = req.body; // Assuming specifications is an array of objects containing spec_name, spec_data, and pro_id
            const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
            console.log("Specification Data :", specifications)

            // Use Promise.all to execute all insert queries asynchronously
            Promise.all(specifications.map(spec => {
                const { pro_id, spec_name, spec_data } = spec;
                return new Promise((resolve, reject) => {
                    const saveData = 'INSERT INTO pro_specification (pro_id, spec_name, spec_data, created_at) VALUES (?, ?, ?, ?)';
                    db.query(saveData, [pro_id, spec_name, spec_data, currentDate], (saveErr, saveRes) => {
                        if (saveErr) {
                            reject(saveErr);
                        } else {
                            resolve();
                        }
                    });
                });
            }))
                .then(() => {
                    res.status(200).json({ message: "Specification Data added successfully." });
                })
                .catch((error) => {
                    console.error("Error processing request:", error);
                    res.status(500).json({ message: "Internal server error." });
                });
        } catch (error) {
            console.error("Error processing request:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    });


    router.get('/getProSpec', (req, res) => {
        try {
            const pro_id = req.query.pro_id;
            const getData = 'SELECT spec.*, pro.pro_name FROM pro_specification spec INNER JOIN products pro ON spec.pro_id = pro.pro_id WHERE spec.pro_id = ?';
            db.query(getData, [pro_id], (getErr, getRes) => {
                if (getErr) {
                    res.status(500).json({ message: "Internal server error." })
                } else if (getRes.length === 0) {
                    res.status(404).json({ message: "Module Not Found." })
                } else {
                    res.status(200).json(getRes)
                }
            })
        } catch (error) {
            console.error("Error processing request:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    })


    router.put('/specUpdate/:spec_id', (req, res) => {
        try {
            const spec_id = req.params.spec_id;
            const { spec_name, spec_data } = req.body;
            const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
            const updateData = 'update pro_specification set spec_name=?,spec_data=?,updated_at=? where spec_id =?';
            db.query(updateData, [spec_name, spec_data, currentDate, spec_id], (updateErr, updateRes) => {
                if (updateErr) {
                    res.status(500).json({ message: "Internal server error." })
                } else {
                    res.status(200).json({ message: "Specification data updated successfully." })
                }
            })

        } catch (error) {
            console.error("Error processing request:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    })


    router.delete('/specDelete/:spec_id', (req, res) => {
        try {
            const spec_id = req.params.spec_id;
            const dltData = 'delete from pro_specification where spec_id =?';
            db.query(dltData, [spec_id], (dltErr, dltRes) => {
                if (dltErr) {
                    res.status(500).json({ message: "Internal server error." })
                } else {
                    res.status(200).json({ message: "Specification data Deleted successfully." })
                }
            })
        } catch (error) {
            console.error("Error processing request:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    })



    router.get('/dashboardForProSale/:city?', (req, res) => {
        const { city } = req.params;
    
        // SQL query to fetch product details for the selected city
        let query = `
            SELECT 
                p.pro_id,
                p.pro_name,
                p.description,
                SUM(COALESCE(pd.quantity, 0)) AS total_quantity,
                SUM(COALESCE(pd.price, 0) * COALESCE(pd.quantity, 0)) AS total_price
            FROM 
                invoicehistory ih
            JOIN 
                customer c ON c.leads_id = ih.leads_id
            JOIN 
                JSON_TABLE(ih.product_details, '$[*]' 
                    COLUMNS (
                        pro_id INT PATH '$.pro_id',
                        quantity DECIMAL(10,2) PATH '$.quantity',
                        price DECIMAL(10,2) PATH '$.price'
                    )
                ) AS pd
            JOIN 
                products p ON pd.pro_id = p.pro_id
        `;
    
        // Append WHERE clause only if city is provided
        if (city) {
            query += ` WHERE c.leads_city = ?`;
        }
    
        // Group results by product ID, name, and description
        query += ` GROUP BY p.pro_id, p.pro_name, p.description`;
    
        // Execute the query
        db.query(query, city ? [city] : [], (error, results) => {
            if (error) {
                console.error("SQL Error: ", error);
                return res.status(500).json({ error: 'Error fetching product sales data', details: error });
            }
            res.json(results);
        });
    });
    
// Route to get product stock details
router.get('/product-stocks', async (req, res) => {
    try {
      // Query to get product details and total purchased quantity
      const productsQuery = `
        SELECT p.pro_id AS productId, p.pro_name AS productName, COALESCE(SUM(pur.quantity), 0) AS totalPurchased
        FROM products p
        LEFT JOIN purchases pur ON p.pro_id = pur.productId
        GROUP BY p.pro_id;
      `;
  
      // Corrected query to get sold quantities from invoicehistory
      const soldQuery = `
        SELECT 
          pro_id AS productId, 
          SUM(quantity) AS totalSold
        FROM invoicehistory ih
        JOIN JSON_TABLE(ih.product_details, '$[*]' COLUMNS (
            pro_id INT PATH '$.pro_id',
            quantity INT PATH '$.quantity'
        )) AS pd ON TRUE
        GROUP BY productId;
      `;
  
      // Execute query to fetch purchased product data
      db.query(productsQuery, (err, products) => {
        if (err) {
          console.error('Error fetching products:', err);
          return res.status(500).json({ error: 'Error fetching products' });
        }
  
        // Execute query to fetch sold product data
        db.query(soldQuery, (err, sold) => {
          if (err) {
            console.error('Error fetching sold data:', err);
            return res.status(500).json({ error: 'Error fetching sold data' });
          }
  
          // Create a map of sold quantities for easy lookup
          const soldMap = {};
          sold.forEach(item => {
            soldMap[item.productId] = parseInt(item.totalSold || 0);
          });
  
          // Combine purchased and sold data
          const productDetails = products.map(product => {
            const totalSold = soldMap[product.productId] || 0;
            const availableStock = product.totalPurchased - totalSold;
  
            return {
              productId: product.productId,
              productName: product.productName,
              totalPurchased: product.totalPurchased,
              totalSold: totalSold,
              availableStock: availableStock,
              price: product.price // Assuming you also want the price here
            };
          });
  
          // Send response with the calculated product details
          res.status(200).json(productDetails);
        });
      });
    } catch (error) {
      console.error('Error fetching product stocks:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

    return router;
};

[{ "price": "1000", "pro_id": 3, "quantity": "30" }, { "price": "2000", "pro_id": 6, "quantity": "2" }, { "price": "1500", "pro_id": 7, "quantity": "10" }]
[{ "price": "1000", "pro_id": 3, "quantity": "30" }, { "price": "2000", "pro_id": 6, "quantity": "2" }, { "price": "1500", "pro_id": 7, "quantity": "10" }]