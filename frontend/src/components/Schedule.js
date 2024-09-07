import React, { useState } from "react";
import { Dropdown } from "react-bootstrap"; // Import Bootstrap Dropdown
import "../styles/Schedule.css"; // Import your custom CSS
import TimeSelector from "./TimeSelector";

const Schedule = ({
  availabilityData,
  selectedUsers,
  handleUserSelect,
  sessionType,
  handleSessionTypeChange,
  selectedDate,
  handleDateChange,
}) => {
  const [startTime, setStartTime] = useState(""); // State for start time
  const [endTime, setEndTime] = useState(""); // State for end time
  const [error, setError] = useState(""); // State for error messages

  // Get unique emails from availabilityData
  const uniqueUsers = Array.from(
    new Set(availabilityData.map((item) => item.userId.email))
  );

  // Function to handle API call based on session type
 const handleScheduleSession = async () => {
   if (!selectedUsers.length || !selectedDate || !startTime || !endTime) {
     setError("Please fill in all fields.");
     return;
   }

   const userIDs = availabilityData
     .filter((item) => selectedUsers.includes(item.userId.email))
     .map((item) => item.userId._id);

   const sessionData = {
     sessionType,
     users: userIDs,
     date: selectedDate,
     day: new Date(selectedDate).toLocaleString("en-US", { weekday: "long" }),
     startTime,
     endTime,
   };

   try {
     const token = localStorage.getItem("token");
     const url =
       sessionType === "one-on-one"
         ? "http://localhost:5000/api/sessions/schedule"
         : "http://localhost:5000/api/sessions/scheduleMultiParticipantSession";

     console.log("Making API call to: ", url);
     console.log("Session Data: ", sessionData);

     const response = await fetch(url, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
       },
       body: JSON.stringify(sessionData),
     });

     if (!response.ok) {
       throw new Error(`Error: ${response.status} ${response.statusText}`);
     }

     const result = await response.json();
     console.log("Session scheduled successfully:", result);
   } catch (err) {
     console.error("API call failed: ", err);
     setError(err.message);
   }
 };

  return (
    <div className="schedule">
      <h1>Scheduling a Session</h1>

      <div className="schedule-form">
        <h2>Select Session Details</h2>

        <label>
          Session Type:
          <select
            value={sessionType}
            onChange={handleSessionTypeChange}
            className="session-type-dropdown"
          >
            <option value="one-on-one">One-on-One</option>
            <option value="multi-participant">Multi-Participant</option>
          </select>
        </label>

        <h2>Select Users</h2>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {selectedUsers.length > 0
              ? selectedUsers.join(", ")
              : "Select Users"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {uniqueUsers.map((email) => (
              <Dropdown.Item
                key={email}
                onClick={() => handleUserSelect(email)}
                disabled={
                  sessionType === "one-on-one" &&
                  selectedUsers.length >= 1 &&
                  !selectedUsers.includes(email)
                }
              >
                {email}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <label className="date-label">
          Date:
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="date-input"
          />
        </label>

        {/* Time Selector for Start and End Time */}
        <TimeSelector
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
        />

        {error && <p className="error-message">{error}</p>}

        {/* Add a button to submit the scheduling */}
        <button className="schedule-button" onClick={handleScheduleSession}>
          Schedule Session
        </button>
      </div>

      {/* Availability Table placed at the bottom */}
      <div className="availability-table-container">
        <h2>All User Available Slots</h2>
        <table className="availability-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Date</th>
              <th>Day</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {availabilityData.map((item) => (
              <tr key={item._id}>
                <td>{item.userId.email}</td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.day}</td>
                <td>{item.startTime}</td>
                <td>{item.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;
