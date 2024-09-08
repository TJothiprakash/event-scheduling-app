import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TimeSelector from "./TimeSelector"; // Import your TimeSelector component
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons for the buttons

const UserView = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [userAvailability, setUserAvailability] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [currentAvailability, setCurrentAvailability] = useState({});

  useEffect(() => {
    const fetchUserAvailability = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/availability/getbookedslots",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user availability");
        }

        const data = await response.json();
        setUserAvailability(data);
      } catch (error) {
        setErrorMessage(error.message);
        setSuccessMessage("");
      }
    };

    fetchUserAvailability();
  }, []);

  const handleScheduleAvailability = async () => {
    try {
      const token = localStorage.getItem("token");
      const startTimeNumber = new Date(
        `${selectedDate}T${startTime}`
      ).getTime();
      const endTimeNumber = new Date(`${selectedDate}T${endTime}`).getTime();

      const availabilityData = {
        date: selectedDate,
        day: new Date(selectedDate).toLocaleString("en-us", {
          weekday: "long",
        }),
        startTime: startTimeNumber,
        endTime: endTimeNumber,
      };

      const response = await fetch("http://localhost:5000/api/availability/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(availabilityData),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule availability");
      }

      const responseData = await response.json();
      setSuccessMessage("Availability scheduled successfully!");
      setErrorMessage("");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };

  const handleDeleteAvailability = async (availabilityId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/availability/deleteavailability/${availabilityId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete availability");
      }

      setUserAvailability((prev) =>
        prev.filter((av) => av._id !== availabilityId)
      );
      setSuccessMessage("Availability deleted successfully!");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };

  const handleUpdateAvailability = async () => {
    const token = localStorage.getItem("token");
    const startTimeNumber = new Date(
      `${currentAvailability.date}T${currentAvailability.startTime}`
    ).getTime();
    const endTimeNumber = new Date(
      `${currentAvailability.date}T${currentAvailability.endTime}`
    ).getTime();

    const availabilityData = {
      date: currentAvailability.date,
      day: new Date(currentAvailability.date).toLocaleString("en-us", {
        weekday: "long",
      }),
      startTime: startTimeNumber,
      endTime: endTimeNumber,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/availability/updateavailability/${currentAvailability._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(availabilityData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update availability");
      }

      const responseData = await response.json();
      setSuccessMessage("Availability updated successfully!");
      setErrorMessage("");
      setShowPopup(false);

      setUserAvailability((prev) =>
        prev.map((av) =>
          av._id === currentAvailability._id
            ? responseData.updatedAvailability
            : av
        )
      );

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };

  const openUpdatePopup = (availability) => {
    setCurrentAvailability({
      ...availability,
      startTime: new Date(availability.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      endTime: new Date(availability.endTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    setShowPopup(true);
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="card border-light" style={{ width: "65%" }}>
        <div className="card-body">
          <Link
            to="/mysessions"
            className="btn btn-link"
            style={{ padding: "0", marginBottom: "10px" }}
          >
            My Sessions
          </Link>
          <h1 className="h4">Schedule Your Availability</h1>

          {/* Display error message */}
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          {/* Display success message */}
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}

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

          {/* Time selection for start and end */}
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

          {/* Display user availability */}
          {userAvailability.length > 0 && (
            <div className="mt-4">
              <h2 className="h5">Your Availability</h2>
              <table className="table table-bordered">
                <thead className="bg-primary text-white">
                  <tr>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Update</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {userAvailability.map((availability) => (
                    <tr key={availability._id}>
                      <td>
                        {new Date(availability.date).toLocaleDateString(
                          "en-GB"
                        )}
                      </td>
                      <td>
                        {new Date(availability.date).toLocaleString("en-US", {
                          weekday: "long",
                        })}
                      </td>
                      <td>
                        {new Date(availability.startTime).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </td>
                      <td>
                        {new Date(availability.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => openUpdatePopup(availability)}
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDeleteAvailability(availability._id)
                          }
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Update Availability Popup */}
          {showPopup && (
            <div
              className="modal show"
              style={{ display: "block" }}
              role="dialog"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Update Availability</h5>
                    <button
                      type="button"
                      className="close"
                      onClick={() => setShowPopup(false)}
                    >
                      &times;
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="date">Select Date:</label>
                      <input
                        type="date"
                        id="date"
                        className="form-control"
                        value={currentAvailability.date}
                        onChange={(e) =>
                          setCurrentAvailability({
                            ...currentAvailability,
                            date: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* Time selection for start and end */}
                    <div className="mb-3">
                      <label htmlFor="time">Select Time:</label>
                      <TimeSelector
                        startTime={currentAvailability.startTime}
                        setStartTime={(time) =>
                          setCurrentAvailability({
                            ...currentAvailability,
                            startTime: time,
                          })
                        }
                        endTime={currentAvailability.endTime}
                        setEndTime={(time) =>
                          setCurrentAvailability({
                            ...currentAvailability,
                            endTime: time,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleUpdateAvailability}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowPopup(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserView;
