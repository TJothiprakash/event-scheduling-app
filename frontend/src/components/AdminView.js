import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Schedule from "./Schedule";
import "../styles/AdminView.css";

const AdminView = () => {
  const [availabilityData, setAvailabilityData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sessionType, setSessionType] = useState("one-on-one");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailabilityData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found");
        setLoading(false); // Set loading to false when token is not found
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
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAvailabilityData();
  }, []);

  const handleUserSelect = (email) => {
    if (sessionType === "one-on-one") {
      setSelectedUsers([email]);
    } else {
      setSelectedUsers((prev) => {
        if (prev.includes(email)) {
          return prev.filter((user) => user !== email);
        } else {
          return [...prev, email];
        }
      });
    }
  };

  const handleSessionTypeChange = (e) => {
    setSessionType(e.target.value);
    setSelectedUsers([]);
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
      {loading ? (
        <p>Loading availability data...</p>
      ) : (
        <div className="scheduling-section">
          <Schedule
            availabilityData={availabilityData}
            selectedUsers={selectedUsers}
            handleUserSelect={handleUserSelect}
            sessionType={sessionType}
            handleSessionTypeChange={handleSessionTypeChange}
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
          />
        </div>
      )}
    </div>
  );
};

export default AdminView;
