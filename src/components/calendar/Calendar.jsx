import React, { useState, useEffect } from "react";
import axios from 'axios';
import newRequest from "../../utils/newRequest";

const CalendarPicker = ({ gig_id, seller_id, buyer_id, onContinueClick }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);


  const getAvailableTimeSlots = (date) => {
    newRequest.get(`/appointments/getAppointments/${gig_id}`)
      .then((response) => {
        setAvailableTimeSlots(response.data);
        console.log("getAppointments", response.data)
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  useEffect(() => {
    getAvailableTimeSlots(selectedDate);
  }, [selectedDate]);
  
  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setSelectedDate(date);
    getAvailableTimeSlots(date);
  };

  const handleSelectSlot = (date, start, end) => {
    const alreadySelected = selectedSlots.find(
      slot => (
        slot.date === date &&
        slot.start === start &&
        slot.end === end &&
        slot.date.getTime() === selectedDate.getTime()
      )
    );
    if (alreadySelected) {
      alert('Sorry, this slot has already been taken. Please select another one.');
      return;
    }
  
    const newSelectedSlot = {
      date: selectedDate,
      start: start,
      end: end,
    };
    setSelectedSlots([...selectedSlots, newSelectedSlot]);
    setStartTime(start);
    setEndTime(end);
    
    // Push the selected slot to the body
    const body = {
      date: newSelectedSlot.date.toLocaleDateString(),
      startTime: start,
      endTime: end,
      gig_id: gig_id,
      seller_id: seller_id,
      buyer_id: buyer_id,
    };
    newRequest.post('/appointments/createAppointment', body)
    .then(response => {
      console.log(response.data); // do something with the response
    })
    .catch(error => {
      console.error(error);
      alert('Failed to add slot');
    });
  
    setSelectedDate(date);
    setStartTime(start);
    setEndTime(end);
  
    // Pass the selected date, start time, and end time to onContinueClick
    if (typeof onContinueClick === 'function') {
      onContinueClick(date, start, end);
    }
  };

  // const handleDateChange = e => {
  //   setSelectedDate(new Date(e.target.value));
  // };

  const getTimeSlots = hour => {
    const timeSlots = [];
    for (let minute = 0; minute < 60; minute += 30) {
      const hourString = hour % 12 === 0 ? "12" : (hour % 12).toString();
      const minuteString = minute.toString().padStart(2, '0');
      const amPm = hour < 12 ? "AM" : "PM";
      const timeString = `${hourString}:${minuteString} ${amPm}`;
      timeSlots.push(timeString);
    }
    return timeSlots;
  };

  const allTimeSlots = [];
  for (let hour = 0; hour < 24; hour++) {
    allTimeSlots.push(...getTimeSlots(hour));
  }

  return (
    <div>
      <h2>Choose date and time</h2>
      <div>
        <label htmlFor="date-input">Date:</label>
        <input
          type="date"
          id="date-input"
          value={selectedDate.toISOString().substr(0, 10)}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="start-time-input">Start Time:</label>
        <select id="start-time-input" value={startTime} onChange={e => setStartTime(e.target.value)}>
          <option value="">Select a start time</option>
          {allTimeSlots.map((time, index) => {
            if (index % 2 === 0) {
              return (
                <option key={time} value={time}>
                  {time}
                </option>
              );
            }
            return null;
          })}
        </select>
      </div>
      <div>
        <label htmlFor="end-time-input">End Time:</label>
        <select id="end-time-input" value={endTime} onChange={e => setEndTime(e.target.value)}>
  <option value="">Select an end time</option>
  {allTimeSlots.map((time, index) => {
    if (index % 2 !== 0) {
      return null;
    } else {
      const nextIndex = index + 1;
      if (nextIndex < allTimeSlots.length) {
        const nextTime = allTimeSlots[nextIndex];
        const timeParts = time.split(':');
        const nextTimeParts = nextTime.split(':');
        const diff = parseInt(nextTimeParts[0], 10) * 60 + parseInt(nextTimeParts[1], 10) - (parseInt(timeParts[0], 10) * 60 + parseInt(timeParts[1], 10));
        if (diff === 30) {
          return (
            <option key={`${time}-${nextTime}`} value={nextTime}>
              {nextTime}
            </option>
          );
        } else {
          return (
            <option key={time} value={time}>
              {time}
            </option>
          );
        }
      } else {
        return (
          <option key={time} value={time}>
            {time}
          </option>
        );
      }
    }
  })}
</select>


      </div>
      <button onClick={() => handleSelectSlot(selectedDate, startTime, endTime)}>
        Select Slot
      </button>
    </div>
  );
};

export default CalendarPicker;
