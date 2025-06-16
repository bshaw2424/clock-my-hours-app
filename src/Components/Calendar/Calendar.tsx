import PayPeriods from "../PayPeriods";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import MonthYearDisplay from "./MonthYearDisplay";
import { useCompany } from "../../Context/CompanyContext";
import { FaStar } from "react-icons/fa";
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
  const [selectedPayPeriod, setSelectedPayPeriod] = useState(null);
  const [selectedPayPeriodId, setSelectedPayPeriodId] = useState(null);
  const [companyShifts, setCompanyShifts] = useState([]);
  const [companyRates, setCompanyRates] = useState([]);
  const [originalShifts, setOriginalShifts] = useState([]);
  const [target, setTarget] = useState("default");

  const totalHoursCompleted = companyShifts
    .filter(companyShift => companyShift?.is_completed)
    .map(totals => totals.worked_hours - totals.lunch_break)
    .reduce((total, amount) => (total += amount), 0);

  const totalHours = companyShifts
    .map(totals => totals.worked_hours - totals.lunch_break)
    .reduce((total, amount) => (total += amount), 0);

  useEffect(() => {
    setPayFrequency(selectedCompany?.pay_frequency);
  }, [selectedCompany?.id]);

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
      try {
        const response = await axios.get("http://localhost:8000/shifts/", {
          withCredentials: true,
        });
        const data = response.data.shifts;
        setOriginalShifts(data);
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    };
    getCompanyShifts();
  }, []);

  useEffect(() => {
    const getCompanyPayRate = async () => {
      try {
        const response = await axios.get("http://localhost:8000/companies/", {
          withCredentials: true,
        });
        setCompanyRates(
          response.data.data.find(c => c.id === selectedCompany?.id),
        );
      } catch (error) {
        console.error("Error fetching company rates:", error);
      }
    };
    getCompanyPayRate();
  }, [selectedCompany?.id]);

  const overtimeTypes = ["double", "triple", "timeHalf"];

  const getShiftTypes = e => {
    const newTarget = e.target.value;
    setTarget(newTarget);

    // Reset the pay period selection when filtering by shift type
    if (newTarget !== target) {
      setSelectedPayPeriod(null);
      setSelectedPayPeriodId(null);
    }
  };

  const handleSelectPayPeriod = (payPeriod, periodId) => {
    setSelectedPayPeriod(payPeriod);
    setSelectedPayPeriodId(periodId);
    setTarget("default");
  };

  const [dateFilteredShifts, setDateFilteredShifts] = useState([]);

  useEffect(() => {
    if (!selectedCompany || !originalShifts.length) return;

    let filtered = originalShifts.filter(
      shift => shift?.company_id === selectedCompany.id,
    );

    if (selectedPayPeriod && selectedPayPeriod.start && selectedPayPeriod.end) {
      const periodStart = new Date(selectedPayPeriod.start);
      const periodEnd = new Date(selectedPayPeriod.end);
      periodStart.setHours(0, 0, 0, 0);
      periodEnd.setHours(23, 59, 59, 999);

      filtered = filtered.filter(shift => {
        const dateField = shift.shift_date || shift.work_date;
        const shiftDate = new Date(dateField);
        return shiftDate >= periodStart && shiftDate <= periodEnd;
      });
    }

    setDateFilteredShifts(filtered);
  }, [selectedPayPeriod, originalShifts, selectedCompany?.id]);

  useEffect(() => {
    let typeFiltered =
      target === "all" || target === "default"
        ? dateFilteredShifts
        : dateFilteredShifts.filter(shift => shift.shift_type === target);
    if (target === "overtime") {
      typeFiltered = dateFilteredShifts.filter(shift =>
        overtimeTypes.includes(shift.shift_type),
      );
    }
    setCompanyShifts(typeFiltered);
  }, [target, dateFilteredShifts]);

  const calculatePayPeriodHours = useMemo(() => {
    return companyShifts
      .reduce((total, shift) => {
        const workedHours = shift.worked_hours || 0;
        const lunchBreak = shift.lunch_break || 0;
        return total + (workedHours - lunchBreak);
      }, 0)
      .toFixed(1);
  }, [companyShifts]);

  // Function to reset filters
  const resetFilters = () => {
    setSelectedPayPeriod(null);
    setSelectedPayPeriodId(null);
    setTarget("default");
  };

  const totalShiftGiveawayHours = companyShifts
    .filter(company => company.shift_type === "giveaway")
    .map(company => company.worked_hours - company.lunch_break)
    .reduce((total, amount) => (total += amount), 0);

  return (
    <section className="mt-5 p-0 w-100 d-flex flex-column justify-content-center align-items-center">
      <div>
        <h1 className="bg-grey w-100 p-0 text-center">
          {company_title.toUpperCase()}
        </h1>
        {/* <p className="text-center">
          <FaStar className="active-icon me-2" />= Current Pay Period
        </p> */}
      </div>

      {/* <div style={{ width: "100%" }}>
        <MonthYearDisplay />
      </div> */}

      <section className="d-flex justify-content-between align-items-center w-100 border border-1 border-dark px-4 my-4 rounded-3">
        <div>
          {payFrequency === "weekly" && (
            <PayPeriods
              payPeriodType={weeklyPayPeriods}
              onSelectPayPeriod={handleSelectPayPeriod}
              selectedPeriodId={selectedPayPeriodId}
            />
          )}
          {payFrequency === "bi-weekly" && (
            <PayPeriods
              payPeriodType={biWeeklyPayPeriods}
              onSelectPayPeriod={handleSelectPayPeriod}
              selectedPeriodId={selectedPayPeriodId}
            />
          )}
          {payFrequency === "semi-monthly" && (
            <PayPeriods
              payPeriodType={semiMonthlyPeriods}
              onSelectPayPeriod={handleSelectPayPeriod}
              selectedPeriodId={selectedPayPeriodId}
            />
          )}
        </div>

        <div>
          <h4>
            Total Hours:{" "}
            <span className="fw-light">
              {totalHoursCompleted}
              {/* / {totalHours} */}
              {/* {calculatePayPeriodHours - totalShiftGiveawayHours} */}
            </span>
          </h4>
        </div>

        <div>
          <p style={{ fontSize: "1.3rem" }}>
            <span>
              <strong>Pay Rate: </strong>
            </span>
            ${selectedCompany?.pay_rate.toFixed(2)}
          </p>
        </div>

        <div className="d-flex gap-2 align-items-center">
          <select
            name="changeShiftType"
            id="shiftType"
            onChange={getShiftTypes}
            value={target}
            className="form-select"
            style={{ maxWidth: "200px" }}
          >
            <option value="default">Filter By Shift Type</option>
            <option value="all">All</option>
            <option value="overtime">Overtime</option>
            <option value="regular">Regular</option>
            <option value="vacation">Vacation</option>
            <option value="sick">Sick</option>
            <option value="holiday">Holiday</option>
            <option value="giveaway">Giveaway</option>
          </select>
          <button
            className="btn btn-outline-secondary btn-sm w-100"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      </section>

      {companyShifts.length === 0 ? (
        <div className="d-flex flex-column min-vh-100">
          {/* Main Content */}
          <div className="flex-grow-1 d-flex justify-content-center align-items-center">
            <h2 className="text-center align-self-start mt-5">
              {selectedPayPeriod
                ? `No ${
                    target !== "default" ? target : ""
                  } Shifts Available for Selected Pay Period`
                : "No Shifts Available"}
            </h2>
          </div>
        </div>
      ) : (
        <Shifts
          companyShifts={companyShifts}
          selectedCompanyId={selectedCompany?.id}
          companyRate={companyRates?.pay_rate}
          selectedPayPeriod={selectedPayPeriod}
        />
      )}
    </section>
  );
};

export default Calendar;
