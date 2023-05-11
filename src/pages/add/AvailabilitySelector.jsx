import React, { useState } from 'react';
import "./Availability.scss"

function AvailabilitySelector({ availability, onChange }) {
  const [selectedDays, setSelectedDays] = useState([]);
  const [sharedTime, setSharedTime] = useState('');
  const [customTimes, setCustomTimes] = useState({});
  const [startTimes, setStartTimes] = useState({});
  const [endTimes, setEndTimes] = useState({});

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const newAvailability = { ...availability, [name]: checked };
    onChange(newAvailability, startTimes, endTimes);

    if (checked) {
      setSelectedDays([...selectedDays, name]);
      initializeCustomTime(name);
    } else {
      setSelectedDays(selectedDays.filter((day) => day !== name));
      removeCustomTime(name);
    }
  };

  const handleSharedTimeChange = (event) => {
    setSharedTime(event.target.value);
  };

  const handleCustomTimeChange = (event, day, field) => {
    const { value } = event.target;
    setCustomTimes((prevCustomTimes) => ({
      ...prevCustomTimes,
      [day]: { ...prevCustomTimes[day], [field]: value },
    }));

    if (field === 'start') {
      setStartTimes((prevStartTimes) => ({
        ...prevStartTimes,
        [day]: value,
      }));
    } else if (field === 'end') {
      setEndTimes((prevEndTimes) => ({
        ...prevEndTimes,
        [day]: value,
      }));
    }
  };

  const handleToggleChange = (event) => {
    const { checked } = event.target;
    if (!checked) {
      setCustomTimes({});
    }
  };

  const initializeCustomTime = (day) => {
    setCustomTimes((prevCustomTimes) => ({
      ...prevCustomTimes,
      [day]: { start: '', end: '' },
    }));
    setStartTimes((prevStartTimes) => ({
      ...prevStartTimes,
      [day]: '',
    }));
    setEndTimes((prevEndTimes) => ({
      ...prevEndTimes,
      [day]: '',
    }));
  };

  const removeCustomTime = (day) => {
    setCustomTimes((prevCustomTimes) => {
      const updatedCustomTimes = { ...prevCustomTimes };
      delete updatedCustomTimes[day];
      return updatedCustomTimes;
    });
    setStartTimes((prevStartTimes) => {
      const updatedStartTimes = { ...prevStartTimes };
      delete updatedStartTimes[day];
      return updatedStartTimes;
    });
    setEndTimes((prevEndTimes) => {
      const updatedEndTimes = { ...prevEndTimes };
      delete updatedEndTimes[day];
      return updatedEndTimes;
    });
  };

  const renderTimeInputs = () => {
    if (selectedDays.length === 0) {
      return null;
    }
  
    return selectedDays.map((day) => (
      <div key={day}>
        <label className="select-day">
          {day.charAt(0).toUpperCase() + day.slice(1)}:
          <select
            className="time-input"
            value={customTimes[day]?.start || ''}
            onChange={(e) => handleCustomTimeChange(e, day, 'start')}
          >
            {generateTimeOptions()}
          </select>
          -
          <select
            className="time-input"
            value={customTimes[day]?.end || ''}
            onChange={(e) => handleCustomTimeChange(e, day, 'end')}
          >
            {generateTimeOptions()}
          </select>
        </label>
      </div>
    ));
  };

  const generateTimeOptions = () => {
    const options = [];

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const isAM = hour < 12;
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const formattedHour = hour12.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const timeString = `${formattedHour}:${formattedMinute} ${isAM ? 'AM' : 'PM'}`;
        options.push(<option key={timeString} value={timeString}>{timeString}</option>);
      }
    }

    return options;
  };
  console.log('availability ==>',availability);

  return (
    <div className="availability-selector">
      <label>
        <input
          className="time-input"
          type="checkbox"
          name="monday"
          checked={availability.monday}
          onChange={handleCheckboxChange}
          minuteInterval={15}
        />
        Monday
      </label>
      <label>
        <input
          className="time-input"
          type="checkbox"
          name="tuesday"
          checked={availability.tuesday}
          onChange={handleCheckboxChange}
        />
        Tuesday
      </label>
      <label>
        <input
          className="time-input"
          type="checkbox"
          name="wednesday"
          checked={availability.wednesday}
          onChange={handleCheckboxChange}
        />
        Wednesday
      </label>
      <label>
        <input
          className="time-input"
          type="checkbox"
          name="thursday"
          checked={availability.thursday}
          onChange={handleCheckboxChange}
        />
        Thursday
      </label>
      <label>
        <input
          className="time-input"
          type="checkbox"
          name="friday"
          checked={availability.friday}
          onChange={handleCheckboxChange}
        />
        Friday
      </label>
      <label>
        <input
          className="time-input"
          type="checkbox"
          name="saturday"
          checked={availability.saturday}
          onChange={handleCheckboxChange}
        />
        Saturday
      </label>
      <label>
        <input
          className="time-input"
          type="checkbox"
          name="sunday"
          checked={availability.sunday}
          onChange={handleCheckboxChange}
        />
        Sunday
      </label>
      {renderTimeInputs()}
    </div>
  );
}

export default AvailabilitySelector;

