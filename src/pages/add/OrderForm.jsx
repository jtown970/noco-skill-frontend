import React, { useState } from 'react';
import AvailabilitySelector from './AvailabilitySelector';

function OrderForm() {
  const [availability, setAvailability] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const [customTimes, setCustomTimes] = useState({});

  const handleAvailabilityChange = (newAvailability) => {
    setAvailability(newAvailability);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const selectedDays = Object.keys(availability).filter((day) => availability[day]);
    const selectedTimes = selectedDays.map((day) => ({
      day,
      start: customTimes[day]?.start || '',
      end: customTimes[day]?.end || '',
    }));
    // Submit the order with the selected availability
    console.log('Selected days:', selectedDays);
    console.log('Selected times:', selectedTimes);
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Days you Work</h2>
      <AvailabilitySelector
        availability={availability}
        onChange={handleAvailabilityChange}
      />
      <button type="submit">Place Order</button>
    </form>
  );
}

export default OrderForm;
