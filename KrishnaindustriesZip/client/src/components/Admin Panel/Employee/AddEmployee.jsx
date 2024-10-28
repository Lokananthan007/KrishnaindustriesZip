import { Button, FormControl, Grid, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../../../config';
import StatesData from '../../States/States.json'

const AddEmployee = ({onClose}) => {
  const [departmentData, setDepartmentData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [languageData, setLanguageData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    dept_id: "",
    role_id: "",
    lang_id: "",
    emp_name: "",
    emp_email: "",
    emp_mobile: "",
    state: "",
    dist: "",
    city: "",
    hire_date: "",
  });
  const [errors, setErrors] = useState({
    dept_id: "",
    role_id: "",
    lang_id: "",
    emp_name: "",
    emp_email: "",
    emp_mobile: "",
    state: "",
    dist: "",
    city: "",
    hire_date: "",
  });

  useEffect(() => {
    if (formData.state) {
      const selectedState = StatesData.states.find(
        (state) => state.state === formData.state
      );
      if (selectedState) {
        setDistricts(selectedState.districts);
        setFormData({ ...formData, dist: "" }); // Reset district field
      }
    }
  }, [formData.state]);

  const handleValidation = (name, value) => {
    let errMsg = "";
    const trimmedValue = value && typeof value === "string" ? value.trim() : value;
    switch (name) {
      case 'emp_name':
        if (!trimmedValue) {
          errMsg = "Employee Name is Required";
        } else if (!/^[a-zA-Z\s]+$/.test(trimmedValue)) {
          errMsg = "Employee Name must contain only letters and spaces";
        }
        break;
      case 'emp_email':
        if (!trimmedValue) {
          errMsg = "Employee Email is Required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
          errMsg = "Invalid email format";
        }
        break;
      case 'emp_mobile':
        if (!trimmedValue) {
          errMsg = "Employee Mobile is Required";
        } else if (!/^\d{10}$/.test(trimmedValue)) {
          errMsg = "Phone number must be 10 digits";
        }
        break;
      case 'dept_id':
        if (!trimmedValue) {
          errMsg = "Department is Required";
        }
        break;
      case 'role_id':
        if (!trimmedValue) {
          errMsg = "Role is Required";
        }
        break;
      case 'lang_id':
        if (!trimmedValue) {
          errMsg = "Language is Required";
        }
        break;
      case 'state':
        if (!trimmedValue) {
          errMsg = "State is Required";
        }
        break;
      case 'dist':
        if (!trimmedValue) {
          errMsg = "District is Required";
        }
        break;
      case 'city':
        if (!trimmedValue) {
          errMsg = "City is Required";
        }
        break;
      case 'hire_date':
        if (!trimmedValue) {
          errMsg = "Hire Date is Required";
        }
        break;
      default:
        break;
    }
    return errMsg;
  };
  

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    const error = handleValidation(name,value);
    setFormData({ ...formData, [name]: value });
    setErrors({...errors,[name]:error})
  };
  
  

  useEffect(() => {
    axios.get(`${config.apiUrl}/department`)
      .then((res) => {
        setDepartmentData(res.data)
        setFormData({ ...formData, role_id: '' })
      })
      .catch((err) => {
        console.log("Error :", err)
      })
  }, []);

  useEffect(() => {
   {formData.dept_id ? (
    axios.get(`${config.apiUrl}/role/getRoleByDept?dept_id=${formData.dept_id}`)
    .then((res) => {
      setRoleData(res.data)
    })
    .catch((err) => {
      console.log("Error :", err)
    })
   ) : (<></>)}
  }, [formData.dept_id])

  useEffect(() => {
    axios.get(`${config.apiUrl}/language`)
      .then((res) => {
        setLanguageData(res.data)
      })
      .catch((err) => {
        console.log("Error :", err)
      })
  })


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let formErrors = {};
    Object.keys(formData).forEach((name) => {
      const value = formData[name];
      const error = handleValidation(name, value);
      if (error) {
        formErrors[name] = error;
      }
    });
  
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    axios.post(`${config.apiUrl}/employee/saveEmp`,formData)
    .then((res)=>{
      console.log("Employee Data stored successfully.");
      onClose();
    })
    .catch((err)=>{
      console.log("Error :",err)
    })
      
    
  };

  return (
    <div>
      <h1 className='text-center'>Add Employee</h1>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name='emp_name'
              label='Employee Name'
              value={formData.emp_name}
              onChange={handleChangeInput}
              error={!!errors.emp_name}
              helperText={errors.emp_name}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name='emp_email'
              label='Employee Email'
              value={formData.emp_email}
              onChange={handleChangeInput}
              error={!!errors.emp_email}
              helperText={errors.emp_email}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name='emp_mobile'
              label='Employee Mobile'
              type = 'number'
              value={formData.emp_mobile}
              onChange={handleChangeInput}
              error={!!errors.emp_mobile}
              helperText={errors.emp_mobile}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              name='dept_id'
              label="Department"
              value={formData.dept_id}
              onChange={handleChangeInput}
              error={!!errors.dept_id}
              helperText={errors.dept_id}
            >
              {departmentData.map((dept, index) => (
                <MenuItem key={index} value={dept.dept_id}>{dept.dept_name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              name='role_id'
              label="Role"
              value={formData.role_id}
              onChange={handleChangeInput}
              error={!!errors.role_id}
              helperText={errors.role_id}
            >
              {roleData.map((role, index) => (
                <MenuItem key={index} value={role.role_id}>{role.role}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              name='lang_id'
              label="Language"
              value={formData.lang_id}
              onChange={handleChangeInput}
              error={!!errors.lang_id}
              helperText={errors.lang_id}
            >
              {languageData.map((lang, index) => (
                <MenuItem key={index} value={lang.lang_id}>{lang.language_name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
        <TextField
          select
          fullWidth
          name="state"
          label="State"
          value={formData.state}
          onChange={handleChangeInput}
          error={!!errors.state}
          helperText={errors.state}
        >
          {StatesData.states.map((state, index) => (
            <MenuItem key={index} value={state.state}>
              {state.state}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={6}>
        <TextField
          select
          fullWidth
          name="dist"
          label="District"
          value={formData.dist}
          onChange={handleChangeInput}
          error={!!errors.dist}
          helperText={errors.dist}
        >
          {districts.map((district, index) => (
            <MenuItem key={index} value={district}>
              {district}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name='city'
              label="City"
              value={formData.city}
              onChange={handleChangeInput}
              error={!!errors.city}
              helperText={errors.city}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name='hire_date'
              label="Hire date"
              type='date'
              value={formData.hire_date}
              onChange={handleChangeInput}
              error={!!errors.hire_date}
              helperText={errors.hire_date}
              InputLabelProps = {{shrink : true}}
            />
          </Grid>
          <Grid item xs={12} display='flex' justifyContent='center'>
            <Button onClick={handleSubmit}>Submit</Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddEmployee;
