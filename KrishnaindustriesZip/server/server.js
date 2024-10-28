const express = require('express')
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const moment = require("moment");
const axios = require("axios");
const multer = require('multer');
const cron = require('node-cron');
const path = require('path');

const port = 2002;
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ss1725758@gmail.com",
    pass: "jssn aehs neyd vkgr",
  },
  logger: true,
  debug: true,
});

app.post('/send-email', (req, res) => {
  const { to, subject, html } = req.body;

  const mailOptions = {
    from: 'ss1725758@gmail.com', 
    to: to,
    subject: subject,
    html: html,

  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      console.error('Error details:', error.message); 
      return res.status(500).json({ error: 'Error sending email', message: error.message });
    }
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Email sent' });
  });
});




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});
const storageExcel = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '_' + uniqueSuffix + extension);
  }
});

const upload = multer({ storage: storage });
const uploadExcel = multer({ storage: storageExcel });


// const db = mysql.createPool({
//   host: '193.203.184.74',
//   port: '3306',
//   user: 'u534462265_asglobal',
//   password: 'ASGlobal@12345',
//   database: 'u534462265_crm'
// })

const db = mysql.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'krishna'
})

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Database connected successfully.");
    connection.release();
  }
});

// =============================================
const fetchAndStoreLeads = async () => {
  console.log("Running auto-fetch leads");
  const startTime = moment().subtract(1, "days").set({ hour: 1, minute: 0, second: 0 }).format("YYYY-MM-DD HH:mm:ss");


  const endTime = moment().format('YYYY-MM-DD HH:mm:ss');

  try {
    console.log(`Start Time: ${startTime}, End Time: ${endTime}`);
    console.log("Fetching leads...");

    const response = await axios.get(`https://mapi.indiamart.com/wservce/crm/crmListing/v2/?glusr_crm_key=mR20Er1s5HfDQPep4XWK7l+Pp1LDnzI=&start_time=${startTime}&end_time=${endTime}`);
    const data = response.data;

    const apiHitTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const count = data.TOTAL_RECORDS || 0;
    const message = data.MESSAGE || `Success. ${count} leads were returned for this API request.`;

    const saveApiLog = 'INSERT INTO api_logs (api_hit_time, start_date, end_date, count, message, created_at) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(saveApiLog, [apiHitTime, startTime, endTime, count, message, apiHitTime], (saveErr) => {
      if (saveErr) {
        console.error('Error saving API log:', saveErr);
      }
    });
    const saveLead = `
      INSERT INTO leads_data (
        unique_query_id, query_type, query_time, sender_name, sender_mobile, sender_email, 
        subject, sender_company, sender_address, sender_city, sender_state, sender_pincode, 
        sender_country_iso, sender_mobile_alt, sender_phone, sender_phone_alt, sender_email_alt, 
        query_product_name, query_message, query_mcat_name, call_duration, receiver_mobile
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE unique_query_id = unique_query_id`; // No-op on duplicate entry

    const leadPromises = data.RESPONSE.map(lead => {
      return new Promise((resolve, reject) => {
        const values = [
          lead.UNIQUE_QUERY_ID,
          lead.QUERY_TYPE,
          lead.QUERY_TIME,
          lead.SENDER_NAME,
          lead.SENDER_MOBILE,
          lead.SENDER_EMAIL || null,
          lead.SUBJECT || null,
          lead.SENDER_COMPANY || null,
          lead.SENDER_ADDRESS || null,
          lead.SENDER_CITY || null,
          lead.SENDER_STATE || null,
          lead.SENDER_PINCODE || null,
          lead.SENDER_COUNTRY_ISO || null,
          lead.SENDER_MOBILE_ALT || null,
          lead.SENDER_PHONE || null,
          lead.SENDER_PHONE_ALT || null,
          lead.SENDER_EMAIL_ALT || null,
          lead.QUERY_PRODUCT_NAME,
          lead.QUERY_MESSAGE || null,
          lead.QUERY_MCAT_NAME || null,
          lead.CALL_DURATION || null,
          lead.RECEIVER_MOBILE || null
        ];

        db.query(saveLead, values, (err) => {
          if (err) {
            console.error('Error saving lead:', err);
            return reject(err);
          }
          resolve();
        });
      });
    });

    await Promise.all(leadPromises);
    console.log('Leads fetched and stored successfully.');
  } catch (error) {
    console.error('Error fetching leads:', error.message);
    console.error(error);
  }
};



// Schedule the task to run every 5 minutes
cron.schedule('*/5 * * * *', fetchAndStoreLeads);

// =============================================
const departmentController = require('./controllers/departmentController')(db);
app.use('/department', departmentController);

const roleController = require('./controllers/roleController')(db);
app.use('/role', roleController);

const languageController = require('./controllers/languageController')(db);
app.use('/language', languageController);

const employeeController = require('./controllers/employeeController')(db, transporter);
app.use('/employee', employeeController);

const leadsController = require('./controllers/leadsController')(db);
app.use('/leads', leadsController);

const purchaseController = require('./controllers/purchaseController')(db);
app.use('/purchase', purchaseController);


const productController = require('./controllers/productController')(db, storage);
app.use('/product', productController);

const quotationController = require('./controllers/quotationController')(db);
app.use('/quotation', quotationController);

const salesController = require('./controllers/salesController')(db);
app.use('/sales', salesController);

const customerController = require('./controllers/customerController')(db);
app.use('/customer', customerController);

const customerPurchaseController = require('./controllers/customerPurchaseController')(db);
app.use('/cust_purch', customerPurchaseController);

const empAttendanceController = require('./controllers/empAttendanceController')(db);
app.use('/emp_attend', empAttendanceController);

app.listen(port, () => {
  console.log(`Server is running ....${port}`)
})
