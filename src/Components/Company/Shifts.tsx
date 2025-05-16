import { RiDeleteBin2Line } from "react-icons/ri";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useState } from "react";
import axios from "axios";

const Shifts = ({
  companyShifts,
  selectedCompanyId,
  companyRate,
  selectedPayPeriod,
}) => {
  const [sortAsc, setSortAsc] = useState(true);
  const [modalData, setModalData] = useState(null);
  const [deletedShift, setDeletedShift] = useState(companyShifts);

  const toggleSort = () => {
    setSortAsc(prev => !prev);
  };

  const safelyParseDate = dateString => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const calculateEarnings = shift => {
    let multiplier = 1;
    if (shift.shift_type === "timeHalf") multiplier = 1.5;
    else if (shift.shift_type === "double") multiplier = 2;
    else if (shift.shift_type === "triple") multiplier = 3;

    return (shift.worked_hours - shift.lunch_break) * companyRate * multiplier;
  };

  const filteredShifts = companyShifts
    .filter(shift => shift.company_id === selectedCompanyId)
    .filter(shift => {
      if (!selectedPayPeriod) return true;

      const workDate = safelyParseDate(shift.work_date);
      const startDate = safelyParseDate(selectedPayPeriod.start);
      const endDate = safelyParseDate(selectedPayPeriod.end);

      if (!workDate || !startDate || !endDate) return false;

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      return workDate >= startDate && workDate <= endDate;
    });

  const groupedShifts = filteredShifts.reduce((acc, shift) => {
    const date = new Date(shift.work_date).toLocaleDateString();

    if (!acc[date]) {
      acc[date] = {
        shifts: [],
        totalHours: 0,
      };
    }

    acc[date].shifts.push(shift);
    acc[date].totalHours += shift.worked_hours - shift.lunch_break;

    return acc;
  }, {});

  const dailySummaries = Object.entries(groupedShifts)
    .map(([date, data]) => {
      const sortedShifts = [...data.shifts].sort((a, b) =>
        a.start_time.localeCompare(b.start_time),
      );

      const earliestShift = sortedShifts[0];
      const totalDailyEarnings = sortedShifts.reduce(
        (sum, s) => sum + calculateEarnings(s),
        0,
      );

      return {
        date,
        shifts: sortedShifts,
        earliestShift,
        totalDailyEarnings,
        hasMultiple: sortedShifts.length > 1,
      };
    })
    .sort((a, b) => {
      const dateA = safelyParseDate(a.date);
      const dateB = safelyParseDate(b.date);
      return sortAsc ? dateA - dateB : dateB - dateA;
    });

  const totalEarnings = dailySummaries.reduce(
    (sum, day) => sum + day.totalDailyEarnings,
    0,
  );

  const handleInfoClick = (date, shifts) => {
    setModalData({ date, shifts });
  };

  const closeModal = () => {
    setModalData(null);
  };

  const deleteShift = async shiftId => {
    const confirmShiftDelete = confirm("Delete Shift?");
    if (!confirmShiftDelete) return;

    try {
      await axios.delete(`http://localhost:8000/shifts/${shiftId}/delete/`, {
        withCredentials: true,
      });
      setDeletedShift(prev => prev.filter(shift => shift.id !== shiftId));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting shift:", error);
      alert("Failed to delete shift.");
    }
  };

  return (
    <>
      {selectedPayPeriod && (
        <div className="mb-3 text-muted">
          Pay Period: {new Date(selectedPayPeriod.start).toLocaleDateString()} -{" "}
          {new Date(selectedPayPeriod.end).toLocaleDateString()}
        </div>
      )}

      {dailySummaries.length > 0 ? (
        <table className="table table-striped">
          <thead className="border border-1 table-dark">
            <tr>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Shift Type</th>
              <th>Notes</th>
              <th>Hours</th>
              <th onClick={toggleSort} style={{ cursor: "pointer" }}>
                Date {sortAsc ? "↑" : "↓"}
              </th>
              <th>Earnings</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dailySummaries.map(
              ({
                date,
                shifts,
                earliestShift,
                totalDailyEarnings,
                hasMultiple,
              }) => (
                <tr key={date}>
                  <td>{earliestShift.start_time}</td>
                  <td>{earliestShift.end_time}</td>
                  <td
                    style={{
                      color:
                        earliestShift.shift_type === "giveaway" ? "red" : "",
                    }}
                  >
                    {earliestShift.shift_type}
                  </td>
                  <td>{earliestShift.notes}</td>
                  <td>{groupedShifts[date].totalHours.toFixed(2)}</td>
                  <td>{date}</td>
                  <td
                    style={{
                      color:
                        earliestShift.shift_type === "giveaway"
                          ? "red"
                          : "#333",
                    }}
                  >
                    {earliestShift.shift_type === "giveaway"
                      ? `- $${totalDailyEarnings.toFixed(2)}`
                      : `$${totalDailyEarnings.toFixed(2)}`}
                  </td>
                  <td>
                    {hasMultiple && (
                      <IoMdInformationCircleOutline
                        size={21}
                        className="cursor-pointer"
                        onClick={() => handleInfoClick(date, shifts)}
                      />
                    )}

                    {!hasMultiple && (
                      <RiDeleteBin2Line
                        size={21}
                        className="cursor-pointer"
                        onClick={() => deleteShift(earliestShift.id)}
                      />
                    )}
                  </td>
                </tr>
              ),
            )}
            <tr className="table-dark">
              <td colSpan={8} className="text-end">
                <strong>Total Period Earnings: </strong>$
                {totalEarnings.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info">
          {selectedPayPeriod
            ? "No shifts found for the selected pay period."
            : "No shifts found. Please select a pay period."}
        </div>
      )}

      {/* Modal */}
      {modalData && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Shifts for {modalData.date}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                {modalData.shifts
                  .sort((a, b) => a.start_time.localeCompare(b.start_time))
                  .map((shift, i) => (
                    <div key={i} className="mb-2 border-bottom pb-2">
                      <strong>
                        {shift.start_time} - {shift.end_time}
                      </strong>
                      <br />
                      Type: {shift.shift_type}
                      <br />
                      Notes: {shift.notes}
                      <br />
                      Lunch: {shift.lunch_break}
                      <br />
                      Hours: {shift.worked_hours - shift.lunch_break}
                      <br />
                      Earnings: ${calculateEarnings(shift).toFixed(2)}
                      <div className="mt-3">
                        <button
                          type="submit"
                          className="btn btn-outline-danger"
                          onClick={() => deleteShift(shift.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Shifts;
