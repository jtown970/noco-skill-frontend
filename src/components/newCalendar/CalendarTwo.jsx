import React, { useState } from 'react';
import moment from 'moment';
import Days from './Days';

function Calendar({ ownerAvailability, userAvailability, onDateSelect }) {
  const [selectedDate, setSelectedDate] = useState(moment());

  const handlePrevMonth = () => {
    setSelectedDate(selectedDate.clone().subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setSelectedDate(selectedDate.clone().add(1, 'month'));
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>Prev</button>
        <h2>{selectedDate.format('MMMM YYYY')}</h2>
        <button onClick={handleNextMonth}>Next</button>
      </div>
      <div className="calendar-body">
        <Days
          selectedDate={selectedDate}
          ownerAvailability={ownerAvailability}
          userAvailability={userAvailability}
          onDateSelect={onDateSelect}
        />
      </div>
    </div>
  );
}

export default Calendar;
