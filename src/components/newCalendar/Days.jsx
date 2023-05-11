import React from "react";
import moment from "moment";
import Day from "./Day";

function Days({ selectedDate, ownerAvailability, userAvailability, onDateSelect }) {
  const daysInMonth = [];
  const monthStart = selectedDate.clone().startOf("month");
  const monthEnd = selectedDate.clone().endOf("month");
  const diffDays = monthEnd.diff(monthStart, "days");

  for (let i = 0; i <= diffDays; i++) {
    const date = monthStart.clone().add(i, "days");
    if (date.isSameOrAfter(moment(), "day")) {
      daysInMonth.push(date);
    }
  }

  const handleDateSelect = (date) => {
    onDateSelect(date);
  };

  return (
    <div className="days">
      {daysInMonth.map((day) => (
        <Day
          key={day.format("YYYY-MM-DD")}
          day={day}
          ownerAvailability={ownerAvailability[day.format("YYYY-MM-DD")]}
          userAvailability={userAvailability[day.format("YYYY-MM-DD")]}
          onDateSelect={handleDateSelect}
        />
      ))}
    </div>
  );
}

export default Days;
