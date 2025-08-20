import { useCompany } from "../Context/CompanyContext";
import { useState, useEffect } from "react";
import VerticalNav from "./VerticalNav";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { IoAddOutline } from "react-icons/io5";

interface Shifts {
  notes: string;
  start_time: string;
  end_time: string;
  work_date: string;
  company_id: number;
  worked_hours: number;
  shift_type: string;
  lunch_break?: number;
}

const Schedule = () => {
  const { companyData, selectedCompany } = useCompany();

  // const [upcomingShift, setUpcomingShift] = useState<Shifts | null>(null);

  const [company, setCompany] = useState<any>();
  const [companyLength, setCompanyLength] = useState([]);
  const navigate = useNavigate();
  console.log(company);

  // 🏢 Fetch Company Info
  useEffect(() => {
    if (!selectedCompany?.id) return;

    const getUserCompany = async () => {
      try {
        const getCompanyData = await axios.get(
          "http://localhost:8000/companies/",
          {
            withCredentials: true,
          },
        );

        const getAllCompanies = getCompanyData.data.data;
        setCompanyLength(getAllCompanies);
        setCompany(getAllCompanies);
      } catch (error) {
        console.error("Error fetching Company Data", error);
      }
    };

    getUserCompany();
  }, [selectedCompany?.id]);

  const deleteCompany = async companyId => {
    if (!companyId) return;

    const findCompanyToDelete = company.find(
      company => company.id === companyId,
    );

    const companyToDelete = window.confirm(
      `Are you sure you want to delete ${findCompanyToDelete?.name}?`,
    );

    if (!companyToDelete) return;

    try {
      await axios.delete(
        `http://localhost:8000/companies/${companyId}/delete/`,
        { withCredentials: true },
      );
      navigate("/dashboard");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const calculateHiredDuration = hiredDateString => {
    const hiredDate = new Date(hiredDateString);
    const today = new Date();

    let years = today.getFullYear() - hiredDate.getFullYear();
    let months = today.getMonth() - hiredDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months };
  };

  const HiredDuration = hiredDate => {
    const { years, months } = calculateHiredDuration(hiredDate);

    return (
      <div>
        <b>Employment:</b> {years} {years === 1 ? "year" : "years"} and {months}{" "}
        {months === 1 ? "month" : "months"}
      </div>
    );
  };

  // Minimum width: @media (width >= 768px) (equivalent to @media (min-width: 768px))
  return (
    <section className="d-flex min-vh-100">
      <div className="h-100">
        <VerticalNav />
      </div>
      {companyData.length > 0 && selectedCompany && (
        <div className="container schedule_container m-5">
          <div className="w-100">
            {companyLength === 0 ? (
              <div className="d-flex flex-column justify-content-center align-items-center h-100">
                <h3 className="m-0">Add Your First Company</h3>
                <div>
                  <span className="me-1">
                    <IoAddOutline />
                  </span>
                  <Link to="/newCompany">Add Company</Link>
                </div>
              </div>
            ) : (
              <div className="mb-3">
                <h2 className="company_total">
                  Companies: {companyLength.length}
                </h2>
              </div>
            )}
          </div>
          <section className="row g-3">
            {companyLength.map(company => (
              <div
                key={company?.id} // Always add key when mapping in React
                className="card rounded-3 d-flex justify-content-center flex-column"
              >
                <div className="card_container d-flex justify-content-between px-2">
                  <div className="w-100">
                    <h4 className="my-3 card-title">
                      <Link to={`/dashboard/${company?.slug}`}>
                        {company?.name}
                      </Link>
                    </h4>
                    <div className="card-body">
                      <div>
                        <p className="m-0">
                          <b>Start Date:</b> {company?.start_date}
                        </p>
                        <p className="mb-3">
                          {HiredDuration(company?.start_date)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="align-self-center button_container">
                    <button
                      type="submit"
                      className="btn btn-danger btn-large me-3"
                      onClick={() => deleteCompany(company?.id)}
                    >
                      Delete
                    </button>
                    <Link
                      className="btn btn-info me-2"
                      to={`/schedule/${company?.slug}/update`}
                    >
                      Update Company
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}
    </section>
  );
};

export default Schedule;
