import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TimeSelector from "./TimeSelector"; // Import your TimeSelector component
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import axios from "axios"; // Import axios for API calls

const UserView = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [userAvailability, setUserAvailability] = useState([]);

  // Fetch user availability on component mount
  useEffect(() => {
    const fetchUserAvailability = async () => {
      try {
        const token = localStorage.getItem("token"); // Replace with your token retrieval logic
       console.log(token);
       
        const response = await axios.get(
          "http://localhost:5000/api/availability/getbookedslots",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserAvailability(response.data); 
        console.log(response.data);
        // Assuming the API returns an array of availability
      } catch (error) {
        console.error("Error fetching user availability:", error);
      }
    };

    fetchUserAvailability();
  }, []);

  const handleScheduleAvailability = () => {
    // Handle scheduling logic here
    console.log("Scheduling Availability:", {
      selectedDate,
      startTime,
      endTime,
    });
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="card border-light" style={{ width: "45%" }}>
        <div className="card-body">
          <Link
            to="/mysessions"
            className="btn btn-link"
            style={{ padding: "0", marginBottom: "10px" }}
          >
            My Sessions
          </Link>
          <h1 className="h4">Schedule Your Availability</h1>

          <div className="mb-3">
            <label htmlFor="date">Select Date:</label>
            <input
              type="date"
              id="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>

          {/* Using a single TimeSelector for both Start and End time */}
          <div className="mb-3">
            <label htmlFor="time">Select Time:</label>
            <TimeSelector
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
            />
          </div>

          <button
            onClick={handleScheduleAvailability}
            className="btn btn-primary"
          >
            Schedule Your Availability
          </button>

          {/* Availability Table */}
          {userAvailability.length > 0 && (
            <div className="mt-4">
              <h2 className="h5">Your Availability</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {userAvailability.map((availability, index) => (
                    <tr key={index}>
                      <td>{availability.date}</td>
                      <td>{availability.startTime}</td>
                      <td>{availability.endTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserView;
