const CompaniesUpdate = () => {
  return (
    <div>
      <h1>Update Company</h1>
      <form action="" method="post">
        <div className="d-flex flex-column">
          <input
            className="form-control"
            type="text"
            name="name"
            value={"name"}
            id="name"
            placeholder="Company Name"
          />
          <input
            className="form-control"
            type="time"
            name="start"
            value={"13:00"}
            id="startTime"
          />
          <input
            className="form-control"
            type="time"
            name="end"
            value={"21:00"}
            id="endTime"
          />
          <input
            className="form-control"
            type="number"
            name="pay"
            id="payRate"
            value={28.25}
          />
          <input
            className="form-control"
            type="date"
            name="startDate"
            id="startDate"
            value={"02 / 23 / 2024"}
          />
        </div>
        <div className="button-container">
          <button className="btn btn-primary w-100">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default CompaniesUpdate;
