const express = require('express');
const router = express.Router();
const moment = require('moment');

module.exports = (db) => {
  
  router.get('/getRoleByDept', (req, res) => {
    const dept_id = req.query.dept_id;
  
    if (!dept_id) {
      return res.status(400).json({ error: 'dept_id is required' });
    }
  
    const getRoles = `SELECT * FROM role WHERE dept_id = ?`;
  
    db.query(getRoles, [dept_id], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server Error.' });
      }else if(results.length === 0){
        res.status(404).json({ error: 'Role Not found given department.' });
      }else{
        res.status(200).json(results)
      }
    });
  });
  

    return router;

}