import Button from "./Components/Button";

const Companies = () => {
  return (
    <form>
      <div>
        <div
          className="d-flex flex-column"
          style={{ width: "50%", margin: "auto" }}
        >
          <h1 className="text-center">Create New Company</h1>
          <label htmlFor="company_name">Company Name: </label>
          <input
            type="text"
            name="company_name"
            id="company_name"
            placeholder="Enter Company Name"
          />
          <label htmlFor="company_wage">Current Pay Wage: </label>
          <input
            type="number"
            name="company_wage"
            id=""
            placeholder="Current wage"
            step="0.01"
            min="0"
            value="0.00"
          />
          <div className="d-flex">
            <label htmlFor="start_time" className="pe-1">
              Start Time:{" "}
            </label>
            <input
              type="time"
              name="start_time"
              id="start_time"
              className="me-3"
            />

            <label htmlFor="end_time" className="pe-1">
              End Time:
            </label>
            <input type="time" name="end_time" id="end_time" />
          </div>
          <label htmlFor="hire-date">Hire Date: </label>
          <input type="date" name="hire-date" id="hire-date" />{" "}
          <Button buttonType="submit" className="btn btn-primary">
            Submit
          </Button>
          <Button buttonType="reset" className="btn btn-danger">
            Reset
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Companies;
