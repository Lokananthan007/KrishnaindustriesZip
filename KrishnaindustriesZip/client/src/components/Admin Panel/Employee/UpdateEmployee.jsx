import { Button, Grid, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../../../config';
import StatesData from '../../States/States.json';

const UpdateEmployee = ({ onClose, data }) => {
  const [departmentData, setDepartmentData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [languageData, setLanguageData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [updateData, setUpdateData] = useState({
    dept_id: data ? data.dept_id : "",
    role_id: data ? data.role_id : "",
    lang_id: data ? data.lang_id : "",
    emp_name: data ? data.emp_name : "",
    emp_email: data ? data.emp_email : "",
    emp_mobile: data ? data.emp_mobile : "",
    state: data ? data.state : "",
    dist: data ? data.dist : "",
    city: data ? data.city : "",
    hire_date: data ? data.hire_date : "",
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
    if (updateData.state) {
      const selectedState = StatesData.states.find(
        (state) => state.state === updateData.state
      );
      if (selectedState) {
        setDistricts(selectedState.districts);
        setUpdateData({ ...updateData, dist: "" }); // Reset district field
      }
    }
  }, [updateData.state]);

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
    const error = handleValidation(name, value);
    setUpdateData({ ...updateData, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  useEffect(() => {
    axios.get(`${config.apiUrl}/department`)
      .then((res) => {
        setDepartmentData(res.data);
        setUpdateData({ ...updateData, role_id: '' });
      })
      .catch((err) => {
        console.log("Error :", err);
      });
  }, []);

  useEffect(() => {
    axios.get(`${config.apiUrl}/role/getRoleByDept?dept_id=${updateData.dept_id}`)
      .then((res) => {
        setRoleData(res.data);
      })
      .catch((err) => {
        console.log("Error :", err);
      });
  }, [updateData.dept_id]);

  useEffect(() => {
    axios.get(`${config.apiUrl}/language`)
      .then((res) => {
        setLanguageData(res.data);
      })
      .catch((err) => {
        console.log("Error :", err);
      });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    let formErrors = {};
    Object.keys(updateData).forEach((name) => {
      const value = updateData[name];
      const error = handleValidation(name, value);
      if (error) {
        formErrors[name] = error;
      }
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    axios.put(`${config.apiUrl}/employee/update/${data.emp_id}`, updateData)
      .then((res) => {
        console.log("Employee Data updated successfully.");
        onClose();
      })
      .catch((err) => {
        console.log("Error :", err);
      });
  };

  return (
    <div>
      <h1 className='text-center'>Update Employee</h1>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name='emp_name'
            label='Employee Name'
            value={updateData.emp_name}
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
            value={updateData.emp_email}
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
            type='number'
            value={updateData.emp_mobile}
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
            value={updateData.dept_id}
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
            value={updateData.role_id}
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
            value={updateData.lang_id}
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
            value={updateData.state}
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
            value={updateData.dist}
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
            value={updateData.city}
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
            value={updateData.hire_date}
            onChange={handleChangeInput}
            error={!!errors.hire_date}
            helperText={errors.hire_date}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} display='flex' justifyContent='center'>
          <Button onClick={handleUpdate}>Update</Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default UpdateEmployee;
