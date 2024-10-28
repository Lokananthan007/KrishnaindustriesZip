import { Button, Grid, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import config from '../../../../config'

const AddProSpecification = ({ pro_id, onClose }) => {
  const [formData, setFormData] = useState([{ pro_id: pro_id, spec_name: '', spec_data: '' }]);
  const [errors, setErrors] = useState([{ spec_name: '', spec_data: '' }]);

  const handleValidation = (name, value) => {
    let errmsg = '';
    const trimmedValue = value && typeof value === 'string' ? value.trim() : value;
    switch (name) {
      case 'spec_name':
        if (!trimmedValue) {
          errmsg = 'Specification name is required.';
        }
        break;
      case 'spec_data':
        if (!trimmedValue) {
          errmsg = 'Specification Data is required.';
        }
        break;
      default:
        break;
    }
    return errmsg;
  };

  const handleChangeInput = (e, index) => {
    const { name, value } = e.target;
    const newFormData = [...formData];
    const error = handleValidation(name, value);
    newFormData[index][name] = value;
    setErrors([...errors.slice(0, index), { ...errors[index], [name]: error }, ...errors.slice(index + 1)]);
    setFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErr = {};
    formData.forEach((data, index) => {
      Object.keys(data).forEach((name) => {
        const value = data[name];
        const error = handleValidation(name, value);
        if (error) {
          formErr = { ...formErr, [index]: { ...formErr[index], [name]: error } };
        }
      });
    });
    if (Object.keys(formErr).length > 0) {
      setErrors(formErr);
    } else {
      axios
        .post(`${config.apiUrl}/product/saveProSpec`, { specifications: formData })
        .then((res) => {
          console.log("Specification Data :", formData)
          onClose();
        })
        .catch((error) => {
          console.log('Specification Data is not added.');
        });
    }
  };

  const handleAddFields = () => {
    setFormData([...formData, { pro_id: pro_id, spec_name: '', spec_data: '' }]);
    setErrors([...errors, { spec_name: '', spec_data: '' }]);
  };

  const handleRemoveFields = (index) => {
    const newFormData = formData.filter((data, idx) => idx !== index);
    const newErrors = errors.filter((err, idx) => idx !== index);
    setFormData(newFormData);
    setErrors(newErrors);
  };

  return (
    <div>
      <h1 className="text-center">Add Specification</h1>
      {formData.map((field, index) => (
        <Grid container spacing={3} className="mt-3" key={index}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="spec_name"
              label="Specification name"
              onChange={(e) => handleChangeInput(e, index)}
              value={field.spec_name}
              error={!!errors[index]?.spec_name}
              helperText={errors[index]?.spec_name}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="spec_data"
              label="Specification Data"
              onChange={(e) => handleChangeInput(e, index)}
              value={field.spec_data}
              error={!!errors[index]?.spec_data}
              helperText={errors[index]?.spec_data}
            />
          </Grid>
          {(index === formData.length - 1) && (
            <Grid item xs={12} display="flex" justifyContent="center">
              <Button onClick={handleSubmit}>Submit</Button>
              <Button onClick={handleAddFields}>Add</Button>
              <Button onClick={() => handleRemoveFields(index)}>Remove</Button>
            </Grid>
          )}
        </Grid>
      ))}
    </div>
  );
};

export default AddProSpecification;
