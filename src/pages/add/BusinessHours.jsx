import React, { useState } from 'react';
import "./BusinessHours.scss"
const BusinessHours = ({ businessHours, setBusinessHours }) => {

  const handleHourChange = (index, hours) => {
    const updatedBusinessHours = [...businessHours];
    updatedBusinessHours[index].hours = hours;
    setBusinessHours(updatedBusinessHours);
  };
  console.log(businessHours);

  return (
    <div>
      <h2>Business Hours</h2>
      {businessHours.map((businessHour, index) => (
        <div key={index}>
          <label>{businessHour.day}</label>
          <input
            className="inputs-color"
            type="text"
            placeholder="e.g.: 8:30am - 5:00pm"
            value={businessHour.hours}
            onChange={(e) => handleHourChange(index, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default BusinessHours;
