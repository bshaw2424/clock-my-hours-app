import { useState, useEffect } from "react";
import ReportViewButtons from "./ReportViewButtons";

const ReportDataTable = ({
  groupedShifts,
  sortedPayPeriods,
  companyPayRate,
  getMultiplier,
  handleExportCSV,
  handleExportPDF,
}) => {
  const safePayPeriods = sortedPayPeriods || [];
  const [selectedPayPeriod, setSelectedPayPeriod] = useState(null);

  useEffect(() => {
    if (safePayPeriods.length > 0) {
      setSelectedPayPeriod(safePayPeriods[0]);
    }
  }, [safePayPeriods]);

  if (!selectedPayPeriod || !groupedShifts[selectedPayPeriod]) {
    return <p>No pay periods available.</p>;
  }

  const allShifts = groupedShifts[selectedPayPeriod] || [];
  const completedShifts = allShifts.filter(shift => shift.is_completed);

  const renameShiftTitle = title => {
    switch (title) {
      case "timeHalf":
        return "Overtime - Time 1/2";
      case "double":
        return "Overtime - X2";
      case "triple":
        return "Overtime - X3";
      default:
        return title;
    }
  };

  const totalEarned = completedShifts.reduce((total, shift) => {
    if (shift.shift_type === "giveaway") shift.worked_hours = 0;
    return (
      total +
      shift.worked_hours * companyPayRate * getMultiplier(shift.shift_type)
    );
  }, 0);

  return (
    <>
      {/* Dropdown to pick pay period */}
      {safePayPeriods.length > 1 && (
        <select
          className="form-select mb-3"
          value={selectedPayPeriod}
          onChange={e => setSelectedPayPeriod(e.target.value)}
        >
          {safePayPeriods.map(label => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      )}

      {/* Title and Total */}
      <h5 className="text-primary">{selectedPayPeriod}</h5>
      <h6 className="text-muted my-3">
        <b>Pay Period Total:</b> ${totalEarned.toFixed(2)}
      </h6>

      {/* Show table if completed shifts exist, otherwise show message */}
      {completedShifts.length > 0 ? (
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Start – End Time</th>
              <th>Worked Hours</th>
              <th>Shift Type</th>
              <th>Pay Rate</th>
              <th>Amount Earned</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {completedShifts.map(shift => {
              const multiplier = getMultiplier(shift.shift_type);
              const earned = (
                shift.shift_type === "giveaway"
                  ? 0
                  : shift.worked_hours * companyPayRate * multiplier
              ).toFixed(2);

              return (
                <tr key={shift.id}>
                  <td>{shift.work_date}</td>
                  <td>
                    {shift.start_time} – {shift.end_time}
                  </td>
                  <td>{shift.worked_hours}</td>
                  <td>{renameShiftTitle(shift.shift_type)}</td>
                  <td>
                    {shift.shift_type === "giveaway"
                      ? "$0.00"
                      : `$${(companyPayRate * multiplier).toFixed(2)}`}
                  </td>
                  <td>${earned}</td>
                  <td>{shift.notes || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-muted">
          No completed shifts available for this pay period.
        </p>
      )}

      {/* Export Buttons */}
      <ReportViewButtons
        handleExportCSV={() => handleExportCSV(selectedPayPeriod)}
        handleExportPDF={() => handleExportPDF(selectedPayPeriod)}
      />
    </>
  );
};

export default ReportDataTable;
