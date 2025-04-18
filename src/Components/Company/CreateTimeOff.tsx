import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCompany } from "../../Context/CompanyContext";

const CreateTimeOff = ({ onBack }) => {
  const [csrfToken, setCsrfToken] = useState("");
  const [formData, setFormData] = useState({
    vacationDays: "",
    sickDays: "",
    dayOffType: "",
  });

  const { selectedCompany } = useCompany();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const response = await axios.get("http://localhost:8000/token/", {
        withCredentials: true,
      });
      setCsrfToken(response.data.csrfToken);
    };
    fetchToken();
  }, []);

  // Add this function to handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        vacation_hours: parseFloat(formData.vacationDays),
        sick_hours: parseFloat(formData.sickDays),
        dayoff_type: formData.dayOffType,
      };
      console.log(payload);

      const response = await axios.post(
        `http://localhost:8000/timeoff/new/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        },
      );

      console.log("TimeOff Created:", response.data);
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Error creating TimeOff:", err);
    }
  };

  return (
    <section className="container my-4">
      <form onSubmit={handleSubmit}>
        <h1 className="mb-4">Company Time Off</h1>
        <input
          className="form-control mb-2"
          type="number"
          name="vacationDays"
          value={formData.vacationDays}
          onChange={handleChange}
          placeholder="Vacation Days"
          required
        />
        <input
          className="form-control mb-2"
          type="number"
          name="sickDays"
          value={formData.sickDays}
          onChange={handleChange}
          placeholder="Sick Days"
          required
        />

        <select
          className="form-select mb-4"
          name="dayOffType"
          value={formData.dayOffType}
          onChange={handleChange}
          required
        >
          <option value="">Select Day Off Type</option>
          <option value="pto">PTO</option>
          <option value="unpaid">Unpaid</option>
          <option value="holiday">Holiday</option>
        </select>

        <div>
          <button type="submit" className="btn btn-primary me-3">
            Submit
          </button>
          <button type="button" className="btn btn-danger" onClick={onBack}>
            Back
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateTimeOff;
