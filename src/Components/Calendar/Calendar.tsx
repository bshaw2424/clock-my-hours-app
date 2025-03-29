import MonthYearDisplay from "./MonthYearDisplay";
// import { useCompany } from "../../Context/CompanyContext";

interface CompanyTitle {
  company_title: string;
  events: [];
  payPeriods: [];
}

const Calendar = ({ company_title }: CompanyTitle) => {
  return (
    <section className="mt-5 p-0">
      <h1 className="bg-grey w-100 p-0 text-center">
        {company_title.toUpperCase()}
      </h1>
      <div className="border border-1 border-dark">
        <MonthYearDisplay />
      </div>
    </section>
  );
};

export default Calendar;
