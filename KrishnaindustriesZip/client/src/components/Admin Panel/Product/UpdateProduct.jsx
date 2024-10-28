import { Button, Grid, Paper, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import config from '../../../config'

const UpdateProduct = ({data,onClose}) => {
    console.log("Reciving update data :",data)
    const [updateData,setUpdateData] = useState({
        pro_name : data ? data.pro_name : "",
        pro_img : data ? data.pro_img : "",
        description : data ? data.description : "",
    });
    const [errors,setErrors] = useState({
        pro_name : "",
        pro_img : "",
        description : "",
    })
    const handleValidation = (name,value) =>{
        let errmsg = "";
        const trimmedValue = value && typeof value === 'string' ? value.trim() : value;
        switch(name){
            case "pro_name":
                if(!trimmedValue){
                    errmsg = "Product Name is required"
                }
                break;
            case "pro_img":
                if(!trimmedValue){
                    errmsg = "Product Image is required"
                }
                break;
            case "description":
                if(!trimmedValue){
                    errmsg = "Product description is required"
                }
                break;
            default:
                break;
        }
        return errmsg;
    }

    const handleChangeInput = (e) => {
        const { name, value, files } = e.target;
        const error = handleValidation(name, value);
        setErrors({ ...errors, [name]: error });
        if (name === 'pro_img') {
            console.log("File object:", files[0]); // Log the file object
            setUpdateData({ ...updateData, pro_img: files[0] }); // Assign the file object directly
        } else {
            setUpdateData({ ...updateData, [name]: value });
        }
    }
    
    

    const handleUpdate = (e) =>{
        e.preventDefault();
        let formErr = {};
        Object.keys(updateData).forEach((name)=>{
            const value = updateData[name];
            const error = handleValidation(name,value);
            if(error){
                formErr[name] = error
            }
        })

        if(Object.keys(formErr).length > 0){
            setErrors(formErr);
        }else{
            const updateDataToSend = new FormData();
            updateDataToSend.append('pro_name',updateData.pro_name);
            updateDataToSend.append('pro_img',updateData.pro_img);
            updateDataToSend.append('description',updateData.description);
            console.log("Updatee Date :",updateDataToSend)
         axios.put(`${config.apiUrl}/product/update/${data.pro_id}`,updateDataToSend)
        .then((res)=>{
            onClose();
        })
        .catch((err)=>{
            console.log("Product image is not added",err)
        })
        }
        
    }
  return (
    <>
        <h1 className='text-center'>Add Product</h1>
      <Grid container spacing={3}  className='mt-3'>
        <Grid item xs={6}>
            <TextField
            fullWidth
            name='pro_name'
            label = "Product Name"
            onChange={handleChangeInput}
            value={updateData.pro_name}
            error = {!!errors.pro_name}
            helperText = {errors.pro_name}
            />
        </Grid>
        <Grid item xs={4}>
        <TextField
            fullWidth
            name='pro_img'
            type='file'
            label = "Product Image"
            onChange={handleChangeInput}
            error = {!!errors.pro_img}
            helperText = {errors.pro_img}
            InputLabelProps={{shrink:true}}
            />
        </Grid>
        <Grid item xs={2}>
            <img src={`http://localhost:3001/uploads/${data.pro_img}`} alt={data.pro_name} height = '50' width = '50'/>
        </Grid>
        <Grid item xs={12}>
        <TextField
            fullWidth
            name='description'
            label = "Product description"
            onChange={handleChangeInput}
            error = {!!errors.description}
            helperText = {errors.description}
            />
        </Grid>
        <Grid item xs={12} display='flex' justifyContent='center'>
            <Button onClick={handleUpdate}>Submit</Button>
        </Grid>
      </Grid>
    </>
  )
}

export default UpdateProduct

