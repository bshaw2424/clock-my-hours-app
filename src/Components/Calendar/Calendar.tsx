import PayPeriods from "../PayPeriods";
import axios from "axios";
import { useEffect, useState } from "react";
import MonthYearDisplay from "./MonthYearDisplay";
import { useCompany } from "../../Context/CompanyContext";
import { FaStar } from "react-icons/fa"; // Star icon for active pay period
import {
  getWeeklyPayPeriodsForYear,
  getBiweeklyPayPeriodsForYear,
  getSemiMonthlyPayPeriodsForYear,
} from "../PayPeriodMethods";
import Shifts from "../Company/Shifts";

interface CompanyTitle {
  company_title: string;
  name: string;
  payPeriods: [];
}

const Calendar = ({ company_title, name }: CompanyTitle) => {
  const { companyData, selectedCompany } = useCompany();

  const [payFrequency, setPayFrequency] = useState(
    selectedCompany?.pay_frequency,
  );

  const [companyShifts, setCompanyShifts] = useState([]);
  const [overtimeShifts, setOvertimeShifts] = useState(false);
  const [companyRates, setCompanyRates] = useState([]);
  const [rates, setRates] = useState(companyRates?.pay_rate);
  const [originalShifts, setOriginalShifts] = useState([]);
  const [target, setTarget] = useState();

  useEffect(() => {
    setPayFrequency(selectedCompany?.pay_frequency);
  }, [selectedCompany?.id]);

  // Ensure pay periods are calculated correctly
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const day = selectedCompany?.pay_period_start;
  const getCompanyDate = new Date(year, month, day).toISOString();

  const semiMonthlyPeriods = selectedCompany
    ? getSemiMonthlyPayPeriodsForYear(
        selectedCompany.pay_period_start ?? 1,
        selectedCompany.pay_period_end ?? 15,
      )
    : [];

  const biWeeklyPayPeriods = selectedCompany
    ? getBiweeklyPayPeriodsForYear(getCompanyDate)
    : [];

  const weeklyPayPeriods = selectedCompany
    ? getWeeklyPayPeriodsForYear(getCompanyDate)
    : [];

  useEffect(() => {
    const getCompanyShifts = async () => {
      const companyShiftsTableResponse = await axios.get(
        "http://localhost:8000/shifts/",
        {
          withCredentials: true,
        },
      );
      const companyShiftTableData = await companyShiftsTableResponse.data
        .shifts;
      setCompanyShifts(companyShiftTableData);
      setOriginalShifts(companyShiftTableData);
    };
    getCompanyShifts();
  }, []);

  useEffect(() => {
    const getCompanyPayRate = async () => {
      const getRate = await axios.get("http://localhost:8000/companies/", {
        withCredentials: true,
      });
      setCompanyRates(
        getRate.data.data.find(company => company.id === selectedCompany?.id),
      );
    };
    getCompanyPayRate();
  }, [selectedCompany.id]);

  const overtimeTypes = ["double", "triple", "timeHalf"];

  const getShiftTypes = e => {
    const selectedType = e.target.value;
    setTarget(selectedType);

    // Always start from the original (unfiltered) data
    let filtered = originalShifts.filter(
      shift => shift?.company_id === selectedCompany?.id,
    );

    if (selectedType === "overtime") {
      filtered = filtered.filter(shift =>
        overtimeTypes.includes(shift.shift_type),
      );
    } else if (selectedType === "all") {
      // all - filtered for company
    } else if (selectedType !== "") {
      filtered = filtered.filter(shift => shift.shift_type === selectedType);
    }

    setCompanyShifts(filtered);
  };

  return (
    <section className="mt-5 p-0  w-100 d-flex flex-column justify-content-center align-items-center">
      <div>
        <h1 className="bg-grey w-100 p-0 text-center">
          {company_title.toUpperCase()}
        </h1>
        <p className="text-center">
          <FaStar className="active-icon me-2" />= Current Pay Period
        </p>
      </div>

      <div style={{ width: "100%" }}>
        <MonthYearDisplay />
      </div>
      <section className="d-flex justify-content-between align-items-center w-100">
        <div>
          {payFrequency === "weekly" && (
            <PayPeriods payPeriodType={weeklyPayPeriods} />
          )}
          {payFrequency === "bi-weekly" && (
            <PayPeriods payPeriodType={biWeeklyPayPeriods} />
          )}
          {payFrequency === "semi-monthly" && (
            <PayPeriods payPeriodType={semiMonthlyPeriods} />
          )}
        </div>
        <p>
          Pay Period Hours: <span>0</span>
        </p>

        <select name="changeShiftType" id="shiftType" onChange={getShiftTypes}>
          <option value="all" selected>
            All
          </option>
          <option value="overtime">Overtime</option>
          <option value="regular">Regular</option>
          <option value="vacation">Vacation</option>
          <option value="sick">Sick</option>
          <option value="holiday">Holiday</option>
          <option value="giveaway">Giveaway</option>
        </select>
      </section>
      {companyShifts.length === 0 ? (
        <div className="border border-1 w-100 py-3 mt-3">
          <h2 className="text-center"> No {target} Shifts Available</h2>
        </div>
      ) : (
        <Shifts
          companyShifts={companyShifts}
          selectedCompanyId={selectedCompany?.id}
          companyRate={companyRates?.pay_rate}
        />
      )}
    </section>
  );
};

export default Calendar;
