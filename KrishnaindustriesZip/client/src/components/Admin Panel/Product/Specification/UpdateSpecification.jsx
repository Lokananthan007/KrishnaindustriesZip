import { Button, Grid, TextField } from '@mui/material'
import axios from 'axios';
import React, { useState } from 'react'
import config from '../../../../config'

const UpdateSpecification = ({data,onClose}) => {
    const [updateData,setUpdateData] = useState({spec_name : data ? data.spec_name : "",spec_data: data ? data.spec_data :""});

    const [errors,setErrors] = useState({spec_name : "",spec_data:""});

    const handleValidation = (name,value) =>{
      let errmsg = "";
      const trimmedValue = value && typeof value === 'string' ? value.trim() : value;
      switch(name){
        case "spec_name":
          if(!trimmedValue){
            errmsg = "Specification name is required."
          }
          break;
        case "spec_data":
          if(!trimmedValue){
            errmsg = "Specification Data is required."
          }
          break;
        default : 
        break;
      }
      return errmsg;
    }

    const handleChangeInput = (e) =>{
      const {name,value} = e.target;
      const error = handleValidation(name,value);
      setErrors({...errors,[name]:error});
      setUpdateData({...updateData,[name]:value});
    } 

    const handleUpdate = (e) =>{
      e.preventDefault();
      let formErr = {};
      Object.keys(updateData).forEach((name)=>{
        const value = updateData[name];
        const error = handleValidation(name,value);
        if(error){
          formErr = error
        }
      })
      if(Object.keys(formErr).length > 0){
        setErrors(formErr);
      }else{
        axios.put(`${config.apiUrl}/product/specUpdate/${data.spec_id}`,updateData)
        .then((res)=>{
          onClose()
        })
        .catch((erro)=>{
          console.log("Specification Data is not added.")
        })
      }
        
    }

  return (
    <div>
      <h1 className='text-center'>Add Specification</h1>
    <Grid container spacing={3} className='mt-3'>
      <Grid item xs={6}>
        <TextField
        fullWidth
        name='spec_name'
        label = "Specification name"
        onChange={handleChangeInput}
        value = {updateData.spec_name}
        error = {!!errors.spec_name}
        helperText = {errors.spec_name}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
        fullWidth
        name='spec_data'
        label = "Specification Data"
        onChange={handleChangeInput}
        value = {updateData.spec_data}
        error = {!!errors.spec_data}
        helperText = {errors.spec_data}
        />
      </Grid>
      <Grid item xs={12} display='flex' justifyContent='center'>
        <Button onClick={handleUpdate}>Submit</Button>
      </Grid>
    </Grid>
    </div>
  )
}

export default UpdateSpecification
