import axios from "axios";
import Button from "../Button";
import { useState, useEffect } from "react";

const CompaniesForm = () => {
  const [csrfToken, setCsrfToken] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    startDate: "",
    payRate: "",
  });

  // Fetch CSRF token when component mounts
  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await axios.get("http://localhost:8000/token/", {
          withCredentials: true, // ensures cookies (including csrf) are sent
        });
        setCsrfToken(response.data.csrfToken); // Make sure your backend returns the CSRF token as 'csrfToken'
      } catch (error) {
        console.error("Error fetching CSRF Token:", error);
      }
    };
    getCsrfToken();
  }, []);

  // method to handle submitting the form
  const createCompanySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/companies/new/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken, // include CSRF token in the headers
          },
          withCredentials: true, // send credentials like cookies
        },
      );

      setFormData({
        name: "",
        startTime: "",
        endTime: "",
        payRate: "",
        startDate: "",
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error Submitting Form:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section style={{ height: "100vh" }}>
      <div className="container h-100 d-flex flex-column justify-content-center">
        <h1 className="mb-3 text-center">Create New Company</h1>
        <form onSubmit={createCompanySubmit}>
          <div className="d-flex flex-column">
            <input
              className="form-control"
              type="text"
              name="name"
              id="name"
              onChange={handleChange}
              // value={formData.name}
              placeholder="Company Name"
            />
            <input
              className="form-control"
              type="time"
              name="startTime"
              id="startTime"
              onChange={handleChange}
              // value={formData.startTime}
              placeholder="Start Time"
            />
            <input
              className="form-control"
              type="time"
              name="endTime"
              id="endTime"
              onChange={handleChange}
              // value={formData.endTime}
              placeholder="End Time"
            />
            <input
              className="form-control"
              type="number"
              name="payRate"
              id="payRate"
              onChange={handleChange}
              value={formData.payRate}
              placeholder="Pay Rate $0.00"
            />
            <input
              className="form-control"
              type="date"
              name="startDate"
              id="startDate"
              placeholder="Start Date"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>
          <Button buttonType="submit" className="btn btn-primary w-100 p-3">
            Create Account
          </Button>
        </form>
      </div>
    </section>
  );
};

export default CompaniesForm;
