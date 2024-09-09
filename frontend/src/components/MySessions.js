import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap"; // Import Table from react-bootstrap
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const MySessions = () => {
  const [sessionsData, setSessionsData] = useState([]); // Initialize as an empty array
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

        // Check if data.sessions exists and is an array before setting the state
        setSessionsData(Array.isArray(data.sessions) ? data.sessions : []);
      } catch (err) {
        console.error("Error fetching sessions data:", err);
        setError(err.message);
      }
    };

    fetchSessionsData();
  }, []);

  // Function to format time to AM/PM
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Remove duplicates based on sessionId
  const uniqueSessions = Array.from(
    new Map(
      sessionsData.map((session) => [session.sessionId, session])
    ).values()
  );

  return (
    <div className="container">
      <h1>My Sessions</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {uniqueSessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Session Admin</th>
              <th>Participant Name</th>
              <th>Participant Email</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {uniqueSessions.map((session) => (
              <tr key={session.sessionId}>
                <td>{session.sessionId}</td>
                <td>{session.adminUsername}</td>
                <td>
                  {session.participants
                    .map((participant) => participant.name)
                    .join(", ")}
                </td>
                <td>
                  {session.participants
                    .map((participant) => participant.email)
                    .join(", ")}
                </td>
                <td>{new Date(session.startTime).toLocaleDateString()}</td>
                <td>{formatTime(session.startTime)}</td>
                <td>{formatTime(session.endTime)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default MySessions;
