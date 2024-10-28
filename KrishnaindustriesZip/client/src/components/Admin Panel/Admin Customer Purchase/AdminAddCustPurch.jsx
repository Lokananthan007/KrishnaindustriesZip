import { Button, Grid, MenuItem, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';

const AdminAddCustPurch = ({cust_id,onClose}) => {
    const [proData,setProData] = useState([]);
    const [custData,setCustData] = useState([])
    const navigate = useNavigate();
    const [formData,setFormData] = useState({
        cust_id : cust_id ?cust_id : "",
        pro_id : "",
        quantity : "",
        price : "",
        payment_type : "",
        payment_amount : "",
        balance : "",
        total : "",
    });
    const [errors,setErrors] = useState({
        cust_id : cust_id,
        pro_id : "",
        quantity : "",
        price : "",
        payment_type : "",
        payment_amount : "",
        balance : "",
        total : "",
    });


    useEffect(()=>{
        axios.get(`${config.apiUrl}/product/getProductData`)
        .then((res)=>{
            setProData(res.data);
        })
        .catch((err)=>{
            console.log("Customer purchase data is not fetched.")
        })
    },[])

    useEffect(()=>{
        axios.get(`${config.apiUrl}/customer/getCustomerForAdmin`)
        .then((res)=>{
            setCustData(res.data)
        })
        .catch((err)=>{
            console.log("Customer data is not fetched.")
        })
    },[])

    const handleValidation = (name,value) =>{
        let errmsg = "";
        const trimmedValue = value && typeof value === 'string' ? value.trim():value;
        switch(name){
            case "pro_id":
                if(!trimmedValue){
                    errmsg = "Product name is required."
                }
                break;
            case "quantity":
                if(!trimmedValue){
                    errmsg = "Quantity is required."
                }
                break;
            case "price":
                if(!trimmedValue){
                    errmsg = "Price is required."
                }
                break;
            case "payment_type":
                if(!trimmedValue){
                    errmsg = "Payment type is required."
                }
                break;
            case "payment_amount":
                if(!trimmedValue){
                    errmsg = "payment_amount Amount is required."
                }
                break;
            case "balance":
                if(!trimmedValue){
                    errmsg = "balance amount is required."
                }
                break;
            case "total":
                if(!trimmedValue){
                    errmsg = "Total amount is required."
                }
                break;
        }
    }

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        let updatedFormData = { ...formData, [name]: value };
        
        // Calculate balance amount if payment_type is 'partial'
        if (name === 'payment_type' && value === 'partial') {
            const total = parseFloat(updatedFormData.total || 0);
            const payment_amount = parseFloat(updatedFormData.payment_amount || 0);
            updatedFormData.balance = (total - payment_amount).toFixed(2);
        } else if (name === 'payment_amount') {
            const total = parseFloat(updatedFormData.total || 0);
            const payment_amount = parseFloat(value || 0);
            updatedFormData.balance = (total - payment_amount).toFixed(2);
        } else if (name === 'quantity' || name === 'price') {
            const quantity = parseFloat(updatedFormData.quantity || 0);
            const price = parseFloat(updatedFormData.price || 0);
            updatedFormData.total = (quantity * price).toFixed(2);
        }
        
        const error = handleValidation(name, value);
        
        setFormData(updatedFormData);
        setErrors({ ...errors, [name]: error });
    };
    
    

    const handleSubmit = (e) => {
        e.preventDefault();
        let formErr = {};
        Object.keys(formData).forEach((name) => {
            const value = formData[name];
            const error = handleValidation(name, value);
            if (error) {
                formErr = error;
            }
        });

        if (Object.keys(formErr).length > 0) {
            setErrors(formErr);
            return;
        }

        axios
            .post(`${config.apiUrl}/cust_purch/addCustPurch`, formData)
            .then((res) => {
                onClose();
                navigate(`/CustPurchIndex`)
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    };
  return (
    <div>
      <Grid container spacing={2}>
      <Grid item xs={6}>
    {cust_id ? (
        <TextField
            select
            fullWidth
            name='cust_id'
            label='Select customer'
            onChange={handleChangeInput}
            value={formData.cust_id}
            disabled
        >
            {custData.map((cust) => (
                <MenuItem key={cust.cust_id} value={cust.cust_id}>{cust.cust_name}</MenuItem>
            ))}
        </TextField>
    ) : (
        <TextField
            select
            fullWidth
            name='cust_id'
            label='Select customer'
            onChange={handleChangeInput}
            value={formData.cust_id}
            error={!!errors.cust_id}
            helperText={errors.cust_id}
        >
            {custData.map((cust) => (
                <MenuItem key={cust.cust_id} value={cust.cust_id}>{cust.cust_name}</MenuItem>
            ))}
        </TextField>
    )}
</Grid>

        <Grid item xs={6}>
            <TextField
            select
            fullWidth
            name = 'pro_id'
            label = 'Select Product Name'
            onChange={handleChangeInput}
            value={formData.pro_id}
            error = {!!errors.pro_id}
            helperText = {errors.pro_id}
            >
                {proData.map((pro)=>(
                    <MenuItem key={pro.pro_id} value={pro.pro_id}>{pro.pro_name}</MenuItem>
                ))}
            </TextField>
        </Grid>
        <Grid item xs={6}>
            <TextField
            fullWidth
            name = 'quantity'
            label = 'Quantity'
            type='number'
            onChange={handleChangeInput}
            value={formData.quantity}
            error = {!!errors.quantity}
            helperText = {errors.quantity}
            />
        </Grid>
        <Grid item xs={6}>
            <TextField
            fullWidth
            name = 'price'
            label = 'Price'
            type='number'
            onChange={handleChangeInput}
            value={formData.price}
            error = {!!errors.price}
            helperText = {errors.price}
            />
        </Grid>
        <Grid item xs={6}>
            <TextField
            select
            fullWidth
            name = 'payment_type'
            label = 'Select Payment type'
            onChange={handleChangeInput}
            value={formData.payment_type}
            error = {!!errors.payment_type}
            helperText = {errors.payment_type}
            >
                 <MenuItem value="full">Full Payment</MenuItem>
                 <MenuItem value="partial">Partial Payment</MenuItem>
            </TextField>
        </Grid>
        <Grid item xs={6}>
            <TextField
            fullWidth
            name = 'total'
            label = 'Total'
            type='number'
            onChange={handleChangeInput}
            value={formData.total}
            error = {!!errors.total}
            helperText = {errors.total}
            />
        </Grid>
        <Grid item xs={6}>
            <TextField
            fullWidth
            name = 'payment_amount'
            label = 'Amount'
            type='number'
            onChange={handleChangeInput}
            value={formData.payment_amount}
            error = {!!errors.payment_amount}
            helperText = {errors.payment_amount}
            />
        </Grid>
        
        <Grid item xs={6}>
            <TextField
            fullWidth
            name = 'balance'
            label = 'Balance Amount'
            type='number'
            onChange={handleChangeInput}
            value={formData.balance}
            error = {!!errors.balance}
            helperText = {errors.balance}
            />
        </Grid>
        <Grid item xs={12} display='flex' justifyContent='center'>
            <Button onClick={handleSubmit}>Submit</Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default AdminAddCustPurch
