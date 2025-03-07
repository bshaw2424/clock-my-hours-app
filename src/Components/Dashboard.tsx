import VerticalNav from "./VerticalNav";
import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "./Calendar/Calendar";
import { useCompany } from "../Context/CompanyContext";
import DataDisplay from "./DataDisplay";

interface Company {
  id: number;
  user_id: number;
  name: string;
  start_time: string;
  end_time: string;
  pay_rate: number;
  created_on: Date;
}

const Dashboard = () => {
  const [companyDetails, setCompanyDetails] = useState<Company[]>([]);
  const [monthlyShifts, setMonthlyShifts] = useState();
  // const [selectedCompany, setSelectedCompany] = useState<Company | null>(null); // Store full company object

  const { companyData, selectedCompany, setSelectedCompany } = useCompany();
  // const [monthlyShifts, setMonthlyShifts] = useState();

  useEffect(() => {
    const getCompanyData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/companies/", {
          withCredentials: true,
        });

        setCompanyDetails(response.data.data);

        // // Set the first company as default
        // if (response.data.data.length > 0) {
        //   setSelectedCompany(response.data.data[0]);
        // }
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    getCompanyData();
  }, []);

  useEffect(() => {
    const getCompanyMonthData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/shifts/${selectedCompany?.id}/monthly/`,
          {
            withCredentials: true,
          },
        );
        setMonthlyShifts(response.data.shifts);

        // // Set the first company as default
        // if (response.data.shifts.length > 0) {
        //   setSelectedCompany(response.data.shifts[0]);
        // }
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    getCompanyMonthData();
  }, [selectedCompany?.id]);

  console.log(monthlyShifts);

  return (
    <section style={{ minHeight: "100vh" }} className="container">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 4fr 2fr",
          gap: "10px",
        }}
      >
        {/* Pass company list and selection handler */}
        <VerticalNav
          companyDetails={companyDetails}
          setSelectedCompany={setSelectedCompany}
        />
        {/* Pass the full company object to Calendar */}
        {selectedCompany && <Calendar company_title={selectedCompany.name} />}
        <aside className="d-flex flex-column">
          <DataDisplay title="Shift Data" />
          <DataDisplay
            title="Company Data"
            shiftData={monthlyShifts}
            message="Hours For Pay Period"
          />
        </aside>
      </div>
    </section>
  );
};

export default Dashboard;
