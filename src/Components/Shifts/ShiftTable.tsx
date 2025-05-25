import { useState } from "react";
import { RiDeleteBin2Line } from "react-icons/ri";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { BiSolidEditAlt } from "react-icons/bi";

const ShiftTable = ({
  dailySummaries,
  toggleSort,
  sortAsc,
  groupedShifts,
  handleInfoClick,
  deleteShift,
}) => {
  const [selectedShift, setSelectedShift] = useState(null);

  const totalEarnings = dailySummaries.reduce((sum, day) => {
    const hasOnlyGiveawayShifts = day.shifts.every(
      s => s.shift_type === "giveaway",
    );
    return hasOnlyGiveawayShifts ? sum : sum + day.totalDailyEarnings;
  }, 0);

  const handleStatusClick = shift => {
    setSelectedShift(shift); // Set selected shift for modal
    // Bootstrap will open modal via data-bs-toggle
  };

  if (dailySummaries.length === 0) {
    return (
      <div className="alert alert-info">
        No shifts found for the selected pay period.
      </div>
    );
  }

  return (
    <>
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
            <th>Status</th>
            <th colSpan={2}>Actions</th>
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
                    color: earliestShift.shift_type === "giveaway" ? "red" : "",
                  }}
                >
                  {earliestShift.shift_type}
                </td>
                <td>{earliestShift.notes}</td>
                <td
                  style={{
                    color: earliestShift.shift_type === "giveaway" ? "red" : "",
                  }}
                >
                  {earliestShift.shift_type === "giveaway"
                    ? `- ${groupedShifts[date].totalHours.toFixed(2)}`
                    : groupedShifts[date].totalHours.toFixed(2)}
                </td>
                <td>{date}</td>
                <td
                  style={{
                    color:
                      earliestShift.shift_type === "giveaway" ? "red" : "#333",
                  }}
                >
                  {earliestShift.shift_type === "giveaway"
                    ? `- $${totalDailyEarnings.toFixed(2)}`
                    : `$${totalDailyEarnings.toFixed(2)}`}
                </td>
                <td>
                  {!hasMultiple ? (
                    <span
                      className={`py-1 px-3 rounded ${
                        ["vacation", "holiday", "giveaway"].includes(
                          earliestShift.shift_type,
                        ) || earliestShift.is_completed
                          ? "btn btn-sm btn-outline-primary"
                          : "btn btn-sm btn-outline-secondary"
                      } ${
                        ["vacation", "holiday", "giveaway"].includes(
                          earliestShift.shift_type,
                        )
                          ? "disabled"
                          : ""
                      }`}
                      data-bs-toggle={
                        ["vacation", "holiday", "giveaway"].includes(
                          earliestShift.shift_type,
                        )
                          ? undefined
                          : "modal"
                      }
                      data-bs-target={
                        ["vacation", "holiday", "giveaway"].includes(
                          earliestShift.shift_type,
                        )
                          ? undefined
                          : "#shiftModal"
                      }
                      onClick={
                        ["vacation", "holiday", "giveaway"].includes(
                          earliestShift.shift_type,
                        )
                          ? undefined
                          : () => handleStatusClick(earliestShift)
                      }
                      style={{ cursor: "default" }}
                    >
                      {["vacation", "holiday", "giveaway", "sick"].includes(
                        earliestShift.shift_type,
                      )
                        ? "completed"
                        : earliestShift.is_completed
                        ? "completed"
                        : "scheduled"}
                    </span>
                  ) : (
                    "( Multiple Shifts )"
                  )}
                </td>
                <td>
                  {hasMultiple ? (
                    <IoMdInformationCircleOutline
                      size={21}
                      className="cursor-pointer"
                      onClick={() => handleInfoClick(date, shifts)}
                    />
                  ) : (
                    <RiDeleteBin2Line
                      size={21}
                      className="cursor-pointer"
                      onClick={() => deleteShift(earliestShift.id)}
                    />
                  )}
                </td>
                <td>{!hasMultiple && <BiSolidEditAlt />}</td>
              </tr>
            ),
          )}
          <tr className="table-dark">
            <td colSpan={10} className="text-end">
              <strong>Total Period Earnings: </strong>$
              {totalEarnings.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Modal HTML, always rendered but only shown when triggered */}
      <div
        className="modal fade"
        id="shiftModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="shiftModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="shiftModalLabel">
                Shift Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedShift ? (
                <>
                  <div>
                    <span>Scheduled Hours</span>
                    <h1>
                      {selectedShift.worked_hours - selectedShift.lunch_break}
                    </h1>
                  </div>
                  <p>
                    <span className="me-3">
                      <strong>Start:</strong> {selectedShift.start_time}
                    </span>

                    <span>
                      <strong>End:</strong> {selectedShift.end_time}
                    </span>
                  </p>
                  <p>
                    <strong>Type:</strong> {selectedShift.shift_type}
                  </p>
                  <p>
                    <strong>Notes:</strong> {selectedShift.notes}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {selectedShift.is_completed ? "Completed" : "Scheduled"}
                  </p>
                </>
              ) : (
                <p>Loading shift details...</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Understood
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShiftTable;
