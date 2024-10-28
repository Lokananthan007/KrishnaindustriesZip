import { Button, Grid, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../../../config'

const EmpFlwLeadsFilter = ({ getData, filter }) => {
    const [employeeData, setEmployeeData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [filterData, setFilterData] = useState({
        startDate: '',
        endDate: '',
        reminderDate: '',
        emp_name: '',
        state: '',
        city: '',
    });

    useEffect(() => {
        axios.get(`${config.apiUrl}/leads/empFollowLeadsForAdmin`)
            .then((res) => {
                const uniqueEmployees = Array.from(new Set(res.data.map(emp => emp.emp_id)))
                    .map(empId => res.data.find(emp => emp.emp_id === empId));
                setEmployeeData(uniqueEmployees);
                const states = new Set(res.data.map(state => state.leads_state));
                setStateData([...states]); // Convert Set to array
                const cities = new Set(res.data.map(city => city.leads_city));
                setCityData([...cities]); // Convert Set to array
            })
            .catch((err) => {
                console.log("Leads data is not fetched.", err)
            });
    }, [])

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setFilterData({ ...filterData, [name]: value });
    }

    const handleFilter = () => {
        getData({
            startDate: filterData.startDate,
            endDate: filterData.endDate,
            emp_id: filterData.emp_name, 
            reminderDate: filterData.reminderDate,
            state: filterData.state,
            city: filterData.city
        });
        filter();
    }
    

    return (
        <Grid container spacing={2} className='mt-3'>
            {/* <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="Start Date"
                    name="startDate"
                    type='date'
                    onChange={handleChangeInput}
                    value={filterData.startDate}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="End Date"
                    name="endDate"
                    type='date'
                    onChange={handleChangeInput}
                    value={filterData.endDate}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid> */}
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    select
                    label="Employee Name"
                    name="emp_name"
                    onChange={handleChangeInput}
                    value={filterData.emp_name}
                >
                    {employeeData.map((emp, index) => (
                        <MenuItem key={index} value={emp.emp_id}>{emp.emp_name}</MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="Reminder Date"
                    name="reminderDate"
                    type='date'
                    onChange={handleChangeInput}
                    value={filterData.reminderDate}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    select
                    label="Select State"
                    name="state"
                    onChange={handleChangeInput}
                    value={filterData.state}
                >
                    {stateData.map((state, index) => (
                        <MenuItem key={index} value={state}>{state}</MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    select
                    label="Select City"
                    name="city"
                    onChange={handleChangeInput}
                    value={filterData.city}
                >
                    {cityData.map((city, index) => (
                        <MenuItem key={index} value={city}>{city}</MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='center'>
                <Button onClick={handleFilter}>Filter</Button>
            </Grid>
        </Grid>
    );
}

export default EmpFlwLeadsFilter;
