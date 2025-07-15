const ReportMonthlyCompensationTotal = ({
  months,
  month,
  year,
  filteredShifts,
  getMultiplier,
  companyPayRate,
}) => {
  // Filter only completed shifts before calculating total
  const completedShifts = filteredShifts.filter(shift => shift.is_completed);

  const total = completedShifts.reduce((total, shift) => {
    if (shift?.shift_type === "giveaway") return total;
    const multiplier = getMultiplier(shift?.shift_type);
    return total + shift?.worked_hours * companyPayRate * multiplier;
  }, 0);

  return (
    <div>
      <h5 className="text-end">
        {`${months[month]} ( ${year} ) Total: `}
        <span className="text-success">${total.toFixed(2)}</span>
      </h5>
    </div>
  );
};

export default ReportMonthlyCompensationTotal;
