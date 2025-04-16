import UpdateForm from "./UpdateForm";
import { useState } from "react";
import TimeOffUpdate from "./TimeOffUpdate";

const CompaniesUpdate = () => {
  const [activeForm, setActiveForm] = useState({
    title: "details",
    btnColor: "blue",
  });

  return (
    <section className="container">
      <div className="my-4">
        <button
          onClick={() => setActiveForm({ title: "details", btnColor: "dark" })}
          className={`btn me-2 ${
            activeForm.title === "details" ? "btn-dark" : "btn-primary"
          }`}
        >
          Basic
        </button>
        <button
          onClick={() => setActiveForm({ title: "timeoff", btnColor: "dark" })}
          className={`btn  ${
            activeForm.title === "timeoff" ? "btn-dark" : "btn-primary"
          }`}
        >
          Time Off
        </button>
      </div>

      {activeForm.title === "details" && <UpdateForm />}
      {activeForm.title === "timeoff" && <TimeOffUpdate />}
    </section>
  );
};

export default CompaniesUpdate;
