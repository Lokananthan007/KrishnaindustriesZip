import React from 'react';

const DateFilter = ({ startDate, endDate, setStartDate, setEndDate, onFilter }) => {
  return (
    <div style={{ display: 'flex',  alignItems: 'center' , margin: '10px 0 '}}>
    <div>
      <label>Start Date:</label>
      <input
                      style={{padding: '5px 10px' , backgroundColor:" #007BB2", color:"white", borderRadius:"5px" , border:"none",marginRight: '10px'}}

        type="date"
        value={startDate ? startDate : ''}
        onChange={(e) => setStartDate(e.target.value)}
      />
    </div>
    <div>
      <label>End Date:</label>
      <input
                      style={{padding: '5px 10px' , backgroundColor:" #007BB2", color:"white", borderRadius:"5px" , border:"none",marginRight: '10px'}}

        type="date"
        value={endDate ? endDate : ''}
        onChange={(e) => setEndDate(e.target.value)}
      />
    </div>
    <button style={{ backgroundColor: "green", color: "white", borderRadius: "5px", border: "none", padding: "5px 10px" }}
onClick={onFilter}>Filter</button>
  </div>
);
};


export default DateFilter;