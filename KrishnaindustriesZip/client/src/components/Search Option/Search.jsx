import React from 'react';
import { TextField } from '@mui/material';

const Search = ({ data, setData }) => {
  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = data.filter((item) => {
      return Object.values(item).some(
        (value) => value && value.toString().toLowerCase().includes(searchValue)
      );
    });
    setData(filteredData);
  };

  return (
    <div>
      <TextField
        label="Search"
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default Search;

