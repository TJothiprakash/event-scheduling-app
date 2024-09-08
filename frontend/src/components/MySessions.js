import React, { useEffect, useState } from "react";

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

  return (
    <div>
      <h1>My Sessions</h1>
      {error && <div>Error: {error}</div>}
      {sessionsData.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <ul>
          {sessionsData.map((session) => (
            <li key={session.sessionId}>
              <h2>Session ID: {session.sessionId}</h2>
              <p>Start Time: {new Date(session.startTime).toLocaleString()}</p>
              <p>End Time: {new Date(session.endTime).toLocaleString()}</p>
              <p>Session Type: {session.sessionType}</p>
              <h3>Participants:</h3>
              <ul>
                {session.participants.map((participant) => (
                  <li key={participant.id}>
                    {participant.name} ({participant.email}) -{" "}
                    {participant.role}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MySessions;
