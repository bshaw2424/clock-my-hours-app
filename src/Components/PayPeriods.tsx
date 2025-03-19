import { useCompany } from "../Context/CompanyContext";

export const PayPeriods = () => {
  const { selectedCompany } = useCompany();
  const currentDate = new Date();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // Ensure values are valid numbers, default to 1st and 15th if missing
  const day = Number(selectedCompany?.pay_period_start) || 1;
  const secondEnd = Number(selectedCompany?.pay_period_end) || 15;

  // Validate that day and secondEnd are within a valid range (1-31)
  if (day < 1 || day > 31 || secondEnd < 1 || secondEnd > 31) {
    console.error("Invalid pay period dates:", { day, secondEnd });
    return [];
  }

  const firstHalfStartPayPeriod = new Date(year, month, day)
    .toISOString()
    .split("T")[0];
  const firstHalfEndPayPeriod = new Date(year, month, secondEnd)
    .toISOString()
    .split("T")[0];
  const secondHalfStartPayPeriod = new Date(year, month, secondEnd + 1)
    .toISOString()
    .split("T")[0];
  const lastDayOfMonthPayPeriod = new Date(year, month + 1, 0)
    .toISOString()
    .split("T")[0];

  const payPeriods = [
    {
      title: "Start Of Pay Period",
      start: firstHalfStartPayPeriod,
    },
    {
      title: "End Of Pay Period",
      start: firstHalfEndPayPeriod,
    },
    {
      title: "Start Of Pay Period",
      start: secondHalfStartPayPeriod,
    },
    {
      title: "End of Pay Period",
      start: lastDayOfMonthPayPeriod,
    },
  ];

  return payPeriods;
};
