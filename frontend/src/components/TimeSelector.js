import React from "react";

const TimeSelector = ({ startTime, setStartTime, endTime, setEndTime }) => {
  return (
    <div className="time-selector">
      <label>
        Start Time:
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </label>
      <label>
        End Time:
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </label>
    </div>
  );
};

export default TimeSelector;
