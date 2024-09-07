import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Schedule from "./Schedule";
import "../styles/AdminView.css"; // Importing the CSS file

const AdminView = () => {
  const [availabilityData, setAvailabilityData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]); // To keep track of selected users
  const [sessionType, setSessionType] = useState("one-on-one"); // Default session type
  const [selectedDate, setSelectedDate] = useState(""); // Store the selected date

  useEffect(() => {
    const fetchAvailabilityData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/availability/all",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch availability data");
        }

        const data = await response.json();
        setAvailabilityData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAvailabilityData();
  }, []);

  const handleUserSelect = (email) => {
    if (sessionType === "one-on-one") {
      setSelectedUsers([email]); // Only allow one user
    } else {
      setSelectedUsers((prev) => {
        if (prev.includes(email)) {
          return prev.filter((user) => user !== email); // Deselect user
        } else {
          return [...prev, email]; // Select user
        }
      });
    }
  };

  const handleSessionTypeChange = (e) => {
    setSessionType(e.target.value);
    setSelectedUsers([]); // Clear selected users when changing session type
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="admin-view">
      <h1>Admin View Page</h1>
      <ul>
        <li>
          <Link to="/mysessions">My Sessions</Link>
        </li>
      </ul>

      {error && <p>Error: {error}</p>}

      <div className="scheduling-section">
        {availabilityData.length > 0 ? (
          <Schedule
            availabilityData={availabilityData}
            selectedUsers={selectedUsers}
            handleUserSelect={handleUserSelect}
            sessionType={sessionType}
            handleSessionTypeChange={handleSessionTypeChange}
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
          />
        ) : (
          <p>Loading availability data...</p>
        )}
      </div>
    </div>
  );
};

export default AdminView;
