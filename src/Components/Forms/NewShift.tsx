import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewShift = () => {
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState("");

  const [shiftData, setShiftData] = useState({
    start_time: "",
    end_time: "",
    shift_type: "",
    lunch_break: "",
    notes: "",
    work_date: new Date().toISOString().split("T")[0], // Default to today's date
  });

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/token/", {
          withCredentials: true,
        });
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error("Error fetching CSRF Token:", error);
      }
    };
    getCsrfToken();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setShiftData({ ...shiftData, [e.target.name]: e.target.value });
  };

  const createNewShift = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/shifts/new/",
        shiftData,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        },
      );
      console.log("Token " + csrfToken);
      console.log("Shift Created:", response.data);
      setShiftData({
        start_time: "",
        end_time: "",
        shift_type: "",
        lunch_break: "",
        notes: "",
        work_date: new Date().toISOString().split("T")[0],
      });

      navigate("/dashboard"); // Redirect after successful submission
    } catch (error) {
      console.error("Error Submitting Form:", error);
    }
  };

  return (
    <form className="container" onSubmit={createNewShift}>
      <h1 className="text-center my-4">Create a Shift</h1>

      <div>
        <label htmlFor="start_time">Start Time</label>
        <input
          type="time"
          className="form-control"
          id="start_time"
          name="start_time"
          value={shiftData.start_time}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="end_time">End Time</label>
        <input
          type="time"
          className="form-control"
          id="end_time"
          name="end_time"
          value={shiftData.end_time}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="shift_type">Shift Type</label>
        <select
          className="form-select"
          name="shift_type"
          value={shiftData.shift_type}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Shift Type
          </option>
          <option value="regular">Regular</option>
          <option value="timeHalf">Time and Half</option>
          <option value="doubleTime">Double Time</option>
          <option value="triple">Triple</option>
        </select>
      </div>

      <div>
        <label htmlFor="lunch_break">Lunch Break</label>
        <select
          className="form-select"
          name="lunch_break"
          value={shiftData.lunch_break}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Lunch Break
          </option>
          <option value="0.5">0.5 hour</option>
          <option value="1">1 hour</option>
        </select>
      </div>

      <div>
        <label htmlFor="notes">Notes</label>
        <input
          type="text"
          className="form-control"
          name="notes"
          placeholder="Add Notes"
          value={shiftData.notes}
          onChange={handleChange}
        />
      </div>

      <div className="my-3 button-container">
        <button type="submit" className="btn btn-primary me-3">
          Submit
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-danger"
        >
          Back
        </button>
      </div>
    </form>
  );
};

export default NewShift;
