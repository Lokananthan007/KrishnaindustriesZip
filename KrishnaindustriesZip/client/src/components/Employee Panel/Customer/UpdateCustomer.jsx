import { Button, Grid, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import config from '../../../config'

const UpdateCustomer = ({ data, onClose }) => {
    const [updateData, setUpdateData] = useState({
        cust_name: data ? data.cust_name : '',
        cust_mobile: data ? data.cust_mobile : '',
        cust_email: data ? data.cust_email : '',
        cust_company: data ? data.cust_company : '',
        cust_address: data ? data.cust_address : '',
        cust_state: data ? data.cust_state : '',
        cust_city: data ? data.cust_city : '',
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
        setUpdateData({ ...updateData, [name]: value });
        setErrors({ ...errors, [name]: error });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        let formErr = {};
        Object.keys(updateData).forEach((name) => {
            const value = updateData[name];
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
            .put(`${config.apiUrl}/customer/update/${data.cust_id}`, updateData)
            .then((res) => {
                onClose();
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    };

    return (
        <>
        <h1 className='text-center'> Update Customer</h1>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Customer Name"
                            name="cust_name"
                            onChange={handleChangeInput}
                            value={updateData.cust_name}
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
                            value={updateData.cust_mobile}
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
                            value={updateData.cust_email}
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
                            value={updateData.cust_company}
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
                            value={updateData.cust_address}
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
                            value={updateData.cust_state}
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
                            value={updateData.cust_city}
                            error={!!errors.cust_city}
                            helperText={errors.cust_city}
                        />
                    </Grid>
                    <Grid item xs={12} display='flex' justifyContent='center'>
                        <Button onClick={handleUpdate} variant="contained" color="primary">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
        </>
    );
};

export default UpdateCustomer;
