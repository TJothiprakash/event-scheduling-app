import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import "../styles/Schedule.css";
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
  const [adminSessionStartTime, setAdminSessionStartTime] = useState("");
  const [adminSessionEndTime, setAdminSessionEndTime] = useState("");
  const [sessionAgenda, setSessionAgenda] = useState("");
  const [sessionMessage, setSessionMessage] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

  const uniqueUsers = Array.from(
    new Set(availabilityData.map((item) => item.userId.email))
  );

  const handleScheduleSession = async () => {
    setError("");
    setSuccessMessage(""); // Clear previous success message

    if (
      !selectedUsers.length ||
      !selectedDate ||
      !adminSessionStartTime ||
      !adminSessionEndTime ||
      !sessionAgenda ||
      !sessionMessage
    ) {
      setError("Please fill in all fields.");
      return;
    }

    // Create an array of participant emails
    const participantEmails = selectedUsers;

    // Debug logs to check input values
    console.log("Start Time String:", adminSessionStartTime);
    console.log("End Time String:", adminSessionEndTime);

    // Append seconds to the time strings
    const startTimeString = `${adminSessionStartTime}:00`;
    const endTimeString = `${adminSessionEndTime}:00`;

    // Create date objects using full date and time strings
    const startTimeDate = new Date(`${selectedDate}T${startTimeString}`);
    const endTimeDate = new Date(`${selectedDate}T${endTimeString}`);

    // Create session data object
    const sessionData = {
      sessionType,
      participants: participantEmails, // Use the array of emails
      date: selectedDate,
      day: new Date(selectedDate).toLocaleString("en-US", { weekday: "long" }),
      adminSessionStartTime: startTimeDate.getTime(), // Convert to timestamp
      adminSessionEndTime: endTimeDate.getTime(), // Convert to timestamp
      sessionAgenda,
      sessionMessage,
    };

    // Log session data to debug
    console.log("Session Data:", sessionData);

    try {
      const token = localStorage.getItem("token");
      const url =
        sessionType === "one-on-one"
          ? "http://localhost:5000/api/sessions/schedule"
          : "http://localhost:5000/api/sessions/scheduleMultiParticipantSession";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        const errorDetails = await response.text(); // Get response text for more details
        throw new Error(
          `Error: ${response.status} ${response.statusText} - ${errorDetails}`
        );
      }

      const result = await response.json();
      console.log("Session scheduled successfully:", result);

      // Set success message after successful session scheduling
      setSuccessMessage("Session scheduled successfully!"); // Set the success message
    } catch (err) {
      console.error("API call failed: ", err);
      setError(err.message);
    }
  };

  return (
    <div className="schedule">
      <h1>Scheduling a Session</h1>

      <div className="schedule-form">
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
        <TimeSelector
          startTime={adminSessionStartTime}
          setStartTime={setAdminSessionStartTime}
          endTime={adminSessionEndTime}
          setEndTime={setAdminSessionEndTime}
        />
        <label className="agenda-label">
          Session Agenda:
          <input
            type="text"
            value={sessionAgenda}
            onChange={(e) => setSessionAgenda(e.target.value)}
            placeholder="Enter session agenda"
            className="agenda-input"
          />
        </label>
        <label className="message-label">
          Session Message:
          <textarea
            value={sessionMessage}
            onChange={(e) => setSessionMessage(e.target.value)}
            placeholder="Enter session message"
            className="message-input"
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        {successMessage && (
          <p className="success-message">{successMessage}</p>
        )}{" "}
        {/* Display success message */}
        <button className="schedule-button" onClick={handleScheduleSession}>
          Schedule Session
        </button>
      </div>

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
