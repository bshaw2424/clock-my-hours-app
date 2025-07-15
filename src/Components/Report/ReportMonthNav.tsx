import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

const ReportMonthNav = ({
  month,
  currentDate,
  year,
  setMonth,
  setYear,
  months,
  getCompany,
}) => {
  const { slug } = useParams();

  const isCurrentMonthYear =
    month === currentDate.getMonth() && year === currentDate.getFullYear();

  const goToPreviousMonth = () => {
    setMonth(prev => (prev === 0 ? (setYear(y => y - 1), 11) : prev - 1));
  };

  const goToNextMonth = () => {
    setMonth(prev => (prev === 11 ? (setYear(y => y + 1), 0) : prev + 1));
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    setMonth(now.getMonth());
    setYear(now.getFullYear());
  };

  return (
    <>
      <div className="col-12 mb-3 mt-4 border-bottom border-2">
        <h1>
          <Link to={`/dashboard/${slug}`}>{getCompany?.name}</Link>
        </h1>
      </div>
      <div className="col-auto my-3 d-flex align-items-center justify-content-center  w-100">
        <button
          className="btn btn-outline-primary me-2"
          onClick={goToPreviousMonth}
        >
          <FaChevronLeft />
        </button>
        <span style={{ margin: "0 1rem", fontSize: "1.7rem" }}>
          {months[month]} {year}
        </span>
        <button
          className="btn btn-outline-primary ms-2"
          onClick={goToNextMonth}
        >
          <FaChevronRight />
        </button>
      </div>
      {!isCurrentMonthYear && (
        <div className="d-flex justify-content-center align-items-center mb-3">
          <button onClick={goToCurrentMonth} className="btn btn-primary w-25">
            Current Month
          </button>
        </div>
      )}
    </>
  );
};

export default ReportMonthNav;
