import { Button, Grid, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import config from '../../../config'

const ConvertCustomer = ({ data, onClose }) => {
    const [formData, setFormData] = useState({
        emp_id: sessionStorage.getItem('emp_id'),
        cust_name: data ? (data.leads_name ? data.leads_name : data.SENDER_NAME) : '',
        cust_mobile: data ? (data.leads_mobile ? data.leads_mobile : data.SENDER_MOBILE) : '',
        cust_email: data ? (data.leads_email ? data.leads_email : data.SENDER_EMAIL) : '',
        cust_company: data ? (data.leads_company ? data.leads_company : data.SENDER_COMPANY) : '',
        cust_address: data ? (data.leads_address ? data.leads_address : data.SENDER_ADDRESS) : '',
        cust_state: data ? (data.leads_state ? data.leads_state : data.SENDER_STATE) : '',
        cust_city: data ? (data.leads_city ? data.leads_city : data.SENDER_CITY) : '',
    });

    const [errors, setErrors] = useState({
        cust_name: '',
        cust_mobile: '',
        cust_email: '',
        cust_company: '',
        cust_address: '',
        cust_state: '',
        cust_city: '',
    });

    const handleValidation = (name, value) => {
        let errmsg = '';
        const trimmedValue = value && typeof value === 'string' ? value.trim() : value;
        switch (name) {
            case 'cust_name':
                if (!trimmedValue) {
                    errmsg = 'Customer name is required.';
                }
                break;
            case 'cust_mobile':
                if (!trimmedValue) {
                    errmsg = 'Customer mobile is required.';
                }
                break;
            case 'cust_email':
                if (!trimmedValue) {
                    errmsg = 'Customer Email is required.';
                }
                break;
            case 'cust_company':
                if (!trimmedValue) {
                    errmsg = 'Customer Company is required.';
                }
                break;
            case 'cust_address':
                if (!trimmedValue) {
                    errmsg = 'Customer Address is required.';
                }
                break;
            case 'cust_state':
                if (!trimmedValue) {
                    errmsg = 'Customer State is required.';
                }
                break;
            case 'cust_city':
                if (!trimmedValue) {
                    errmsg = 'Customer City is required.';
                }
                break;
            default:
                break;
        }
        return errmsg;
    };

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        const error = handleValidation(name, value);
        setFormData({ ...formData, [name]: value });
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
            .post(`${config.apiUrl}/customer/convertCustomer`, formData)
            .then((res) => {
                onClose();
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    };

    return (
        <>
        <h1 className='text-center'>Convert Customers</h1>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Customer Name"
                            name="cust_name"
                            onChange={handleChangeInput}
                            value={formData.cust_name}
                            error={!!errors.cust_name}
                            helperText={errors.cust_name}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Customer Mobile"
                            name="cust_mobile"
                            onChange={handleChangeInput}
                            value={formData.cust_mobile}
                            error={!!errors.cust_mobile}
                            helperText={errors.cust_mobile}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Customer Email"
                            name="cust_email"
                            onChange={handleChangeInput}
                            value={formData.cust_email}
                            error={!!errors.cust_email}
                            helperText={errors.cust_email}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Customer Company"
                            name="cust_company"
                            onChange={handleChangeInput}
                            value={formData.cust_company}
                            error={!!errors.cust_company}
                            helperText={errors.cust_company}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Customer Address"
                            name="cust_address"
                            onChange={handleChangeInput}
                            value={formData.cust_address}
                            error={!!errors.cust_address}
                            helperText={errors.cust_address}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Customer State"
                            name="cust_state"
                            onChange={handleChangeInput}
                            value={formData.cust_state}
                            error={!!errors.cust_state}
                            helperText={errors.cust_state}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Customer City"
                            name="cust_city"
                            onChange={handleChangeInput}
                            value={formData.cust_city}
                            error={!!errors.cust_city}
                            helperText={errors.cust_city}
                        />
                    </Grid>
                    <Grid item xs={12} display='flex' justifyContent='center'>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
        </>
    );
};

export default ConvertCustomer;
