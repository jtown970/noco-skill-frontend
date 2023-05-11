import React from "react";

function Day({ day, isAvailable, isSelected, onDateSelect }) {
  const handleClick = () => {
    onDateSelect(day);
  };

  const className = `day ${!isAvailable ? "unavailable" : ""} ${
    isSelected ? "selected" : ""
  }`;

  return (
    <div
      className={className}
      onClick={isAvailable ? handleClick : null}
      role="button"
      tabIndex={0}
    >
      <div className="day-number">{day.format("D")}</div>
      <div className="day-availability">
        {isAvailable ? "Available" : "Unavailable"}
      </div>
    </div>
  );
}

export default Day;
