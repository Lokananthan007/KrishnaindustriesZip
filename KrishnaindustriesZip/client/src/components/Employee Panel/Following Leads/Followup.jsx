import { Grid, TextField, MenuItem, Button } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import config from '../../../config';

const Followups = ({ onClose,data }) => {
    const [updateData, setUpdateData] = useState({
        leads_name: data ? data.leads_name : "",
        leads_mobile: data ? data.leads_mobile : "",
        leads_email: data ? data.leads_email : "",
        leads_company: data ? data.leads_company : "",
        leads_address: data ? data.leads_address : "",
        leads_state: data ? data.leads_state : "",
        leads_city: data ? data.leads_city : "",
        product_name: data ? data.product_name : "",
        Call_Discussion: data ? data.Call_Discussion :"",
        remember: data ? data.remember :"",
        reminder_date: data ? data.reminder_date : "",
    });

    const [errors, setErrors] = useState({
        Call_Discussion: "",
        remember: "",
        reminder_date: "",
    });

    const handleValidation = (name, value) => {
        let errMsg = "";
        const trimmedValue = value && typeof value === 'string' ? value.trim() : value;
        switch (name) {
            case "Call_Discussion":
                if (!trimmedValue) {
                    errMsg = "Leads Query Message is Required";
                }
                break;
            case "remember":
                if (!trimmedValue) {
                    errMsg = "Please Select one";
                } else if (trimmedValue === "yes" && !updateData.reminder_date) { 
                    errMsg = "Reminder Date is Required";
                }
                break;
            default:
                break;
        }
        return errMsg;
    };
    

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        const error = handleValidation(name, value);
        setUpdateData({ ...updateData, [name]: value });
        setErrors({ ...errors, [name]: error });
    };

    const handleUpdate = (e) =>{
        e.preventDefault()
        let formErrors = {};

        Object.keys(updateData).forEach((name)=>{
            const value = updateData[name];
            const error = handleValidation(name,value);
            if(error){
                formErrors[name] = error;
            }
        })

        if(Object.keys(formErrors).length > 0){
            setErrors(formErrors);
        }

        axios.put(`${config.apiUrl}/leads/updateFlwLeadForEmp/${data.follow_id}`,updateData)
        .then((res)=>{
            console.log("Data Added Successfully.",res)
            onClose()
        })
        .catch((err)=>{
            console.log("Data is not added",err)
        })
    }

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <TextField
                    fullWidth
                        name="leads_name"
                        label="Lead Name"
                        value={updateData.leads_name}
                        onChange={handleChangeInput}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    fullWidth
                        name="leads_mobile"
                        label="Lead Mobile"
                        value={updateData.leads_mobile}
                        onChange={handleChangeInput}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    fullWidth
                        name="leads_email"
                        label="Lead Email"
                        value={updateData.leads_email}
                        onChange={handleChangeInput}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    fullWidth
                        name="leads_company"
                        label="Lead Company"
                        value={updateData.leads_company}
                        onChange={handleChangeInput}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    fullWidth
                        name="leads_address"
                        label="Lead Address"
                        value={updateData.leads_address}
                        onChange={handleChangeInput}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    fullWidth
                        name="leads_state"
                        label="Lead State"
                        value={updateData.leads_state}
                        onChange={handleChangeInput}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    fullWidth
                        name="leads_city"
                        label="Lead City"
                        value={updateData.leads_city}
                        onChange={handleChangeInput}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    fullWidth
                        name="product_name"
                        label="Product Name"
                        value={updateData.product_name}
                        onChange={handleChangeInput}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    fullWidth
                        name="Call_Discussion"
                        label="Leads Query"
                        value={updateData.Call_Discussion}
                        onChange={handleChangeInput}
                        error={!!errors.Call_Discussion}
                        helperText={errors.Call_Discussion}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    fullWidth
                        select
                        name="remember"
                        label="Remember"
                        value={updateData.remember}
                        onChange={handleChangeInput}
                        error={!!errors.remember}
                        helperText={errors.remember}
                    >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </TextField>
                </Grid>
                {updateData.remember === "Yes" && (
                    <Grid item xs={6}>
                        <TextField
                        fullWidth
                            name="reminder_date"
                            label="Reminder Date"
                            type="date"
                            value={updateData.reminder_date}
                            onChange={handleChangeInput}
                            error={!!errors.reminder_date}
                            helperText={errors.reminder_date}
                            InputLabelProps={{shrink:true}}
                        />
                    </Grid>
                )}
                <Grid item xs={12} display='flex' justifyContent='center'>
                    <Button onClick={handleUpdate}>Submit</Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default Followups;
