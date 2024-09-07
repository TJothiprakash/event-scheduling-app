import React, { useEffect, useState } from "react";
import "../styles/MySessions.css"; // Optional: Import your CSS file for styling

const MySessions = () => {
  const [sessionsData, setSessionsData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessionsData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/sessions/mysessions",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the Authorization header
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch sessions data");
        }

        const data = await response.json();
        console.log("Fetched sessions data:", data);
        setSessionsData(data);
      } catch (err) {
        console.error("Error fetching sessions data:", err);
        setError(err.message);
      }
    };

    fetchSessionsData();
  }, []);

  return (
    <div className="my-sessions">
      <h2>My Sessions</h2>
      <p>Here you can view all your sessions.</p>

      {error && <p>Error: {error}</p>}

      {sessionsData.length > 0 ? (
        <table className="sessions-table">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {sessionsData.map((session) => (
              <tr key={session._id}>
                <td>{session._id}</td>
                <td>{new Date(session.date).toLocaleDateString()}</td>
                <td>{session.startTime}</td>
                <td>{session.endTime}</td>
                <td>{session.details || "No details"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No sessions found.</p>
      )}
    </div>
  );
};

export default MySessions;
