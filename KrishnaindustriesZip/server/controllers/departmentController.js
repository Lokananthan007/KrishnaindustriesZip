const express = require('express');
const router = express.Router();
const multer = require('multer');

module.exports = (db) => {
  
  router.get('/',(req,res)=>{
    const getData = ' select * from department';
    db.query(getData,(err,result)=>{
      if(err){
        res.status(500).json({message:"Internal server error."})
      }else if(result.length === 0){
        res.status(404).json({message:"Department Data not found."})
      }else{
        res.status(200).json(result)
      }
    })
  })
  return router;
};
