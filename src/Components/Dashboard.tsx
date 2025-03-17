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

interface Shifts {
  notes: string;
  start_time: string;
  end_time: string;
  work_date: string;
}

const Dashboard = () => {
  const [companyDetails, setCompanyDetails] = useState<Company[]>([]);
  const [monthlyShifts, setMonthlyShifts] = useState();
  const [shifts, setShifts] = useState<Shifts[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date())
  // const [shifts, setShifts] = useState<Shifts[]>([])
  // const [selectedCompany, setSelectedCompany] = useState<Company | null>(null); // Store full company object

  const { companyData, selectedCompany, setSelectedCompany } = useCompany();
  const formatEventDateTime = (time: string, date: string) => {
    return `${date}T${time}`;
  };

  useEffect(() => {
    const getCompanyData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/companies/", {
          withCredentials: true,
        });

        setCompanyDetails(response.data.data);

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
        
        const getShifts = response.data.shifts.map((shift: Shifts) => ({
          title: shift.notes,
          start: formatEventDateTime(shift.start_time, shift.work_date),
          end: formatEventDateTime(shift.end_time, shift.work_date),
        }));

         const month = currentDate.getMonth()
        const year = currentDate.getFullYear()
        const day = currentDate.getDate()
        const say = new Date(year, month, day).toISOString()

        const details = companyDetails.find(company => company?.id === selectedCompany?.id)
        
        const startTime = new Date(year, month, details.pay_period_start).toISOString()
        const endTime = new Date(year, month, details.pay_period_end).toISOString()
        const a = new Date(year, month, details.pay_period_end + 1).toISOString()
        const a_end = new Date(year, month + 1, 0).toISOString()
        console.log(startTime, endTime, a, a_end)

        

        
    
        setMonthlyShifts(response.data.shifts);
        setShifts(getShifts);
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    getCompanyMonthData();
  }, [selectedCompany?.id]);

  return (
    <section style={{ minHeight: "100vh" }} className="container">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 4fr 2fr",
          gap: "10px",
        }}
        className="mb-5"
      >
        {/* Pass company list and selection handler */}
        <VerticalNav
          companyDetails={companyDetails}
          setSelectedCompany={setSelectedCompany}
        />
        {/* Pass the full company object to Calendar */}
        {selectedCompany && (
          <Calendar company_title={selectedCompany.name} events={shifts} />
        )}

        <div className="d-flex flex-column w-100 border border-1 border-dark mt-4">
          <DataDisplay title="Shift Data" />
          <DataDisplay
            title="Company Data"
            shiftData={monthlyShifts}
            message="Hours For Pay Period"
          />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
