const express = require('express');
const router = express.Router();
const moment = require('moment');

module.exports = (db) => {
  
  router.get('/', (req, res) => {
    const getData = `SELECT * FROM languages`;
  
    db.query(getData, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server Error.' });
      }else if(results.length === 0){
        res.status(404).json({ error: 'Language Not Found.' });
      }else{
        res.status(200).json(results)
      }
    });
  });
  

    return router;

}