import { Button, Grid, Paper, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import config from '../../../config'

const AddProduct = ({onClose}) => {
    const [formData,setFormData] = useState({
        pro_name : "",
        pro_img : "",
        description : "",
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

    const handleChangeInput = (e) =>{
        const {name,value,files } = e.target;
        const error = handleValidation(name,value);
        setErrors({...errors,[name]:error});
        if(name == 'pro_img'){
            setFormData({...formData,[name]:files[0]});
        }else{
            setFormData({...formData,[name]:value});
        }
        
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        let formErr = {};
        Object.keys(formData).forEach((name)=>{
            const value = formData[name];
            const error = handleValidation(name,value);
            if(error){
                formErr[name] = error
            }
        })

        if(Object.keys(formErr).length > 0){
            setErrors(formErr);
        }else{
            const formDataToSend = new FormData();
            formDataToSend.append('pro_name',formData.pro_name);
            formDataToSend.append('pro_img',formData.pro_img);
         axios.post(`${config.apiUrl}/product/saveProduct`,formDataToSend)
        .then((res)=>{
           onClose()
        })
        .catch((err)=>{
            console.log("Product image is not added",err)
        })
        }
        
    }
  return (
    <div>
        <h1 className='text-center'>Add Product</h1>
      <Grid container spacing={3}  className='mt-3'>
        <Grid item xs={6}>
            <TextField
            fullWidth
            name='pro_name'
            label = "Product Name"
            onChange={handleChangeInput}
            value={formData.pro_name}
            error = {!!errors.pro_name}
            helperText = {errors.pro_name}
            />
        </Grid>
        <Grid item xs={6}>
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
            <Button onClick={handleSubmit}>Submit</Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default AddProduct
