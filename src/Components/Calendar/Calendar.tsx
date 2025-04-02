import PayPeriods from "../PayPeriods";
import { useEffect, useState } from "react";
import MonthYearDisplay from "./MonthYearDisplay";
import { useCompany } from "../../Context/CompanyContext";
import { FaStar } from "react-icons/fa"; // Star icon for active pay period
import {
  getWeeklyPayPeriodsForYear,
  getBiweeklyPayPeriodsForYear,
  getSemiMonthlyPayPeriodsForYear,
} from "../PayPeriodMethods";

interface CompanyTitle {
  company_title: string;
  payPeriods: [];
}

const Calendar = ({ company_title }: CompanyTitle) => {
  const { selectedCompany } = useCompany();
  const [payFrequency, setPayFrequency] = useState(
    selectedCompany?.pay_frequency,
  );

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

  return (
    <section className="mt-5 p-0">
      <div>
        <h1 className="bg-grey w-100 p-0 text-center">
          {company_title.toUpperCase()}
        </h1>
        <p className=" text-center">
          <FaStar className="active-icon me-2" />= Current Pay Period
        </p>
      </div>

      <div>
        <MonthYearDisplay />
        <section>
          {payFrequency === "weekly" && (
            <PayPeriods payPeriodType={weeklyPayPeriods} />
          )}
          {payFrequency === "bi-weekly" && (
            <PayPeriods payPeriodType={biWeeklyPayPeriods} />
          )}
          {payFrequency === "semi-monthly" && (
            <PayPeriods payPeriodType={semiMonthlyPeriods} />
          )}
        </section>
      </div>
    </section>
  );
};

export default Calendar;
