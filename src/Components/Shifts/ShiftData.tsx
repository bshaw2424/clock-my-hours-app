import { IoMdInformationCircleOutline } from "react-icons/io";
const ShiftData = ({
  dailySummaries,
  toggleSort,
  sortAsc,
  groupedShifts,
  handleInfoClick,
  deleteShift,
  handleStatusClick,
  totalEarnings,
}) => {
  return (
    <>
      {dailySummaries.map(
        ({ date, shifts, earliestShift, totalDailyEarnings, hasMultiple }) => (
          <tr key={date}>
            <td className="py-2">{earliestShift.start_time}</td>
            <td>{earliestShift.end_time}</td>
            <td
              style={{
                color: earliestShift.shift_type === "giveaway" ? "red" : "",
              }}
              className="text-center"
            >
              {earliestShift.shift_type}
            </td>
            <td className="text-center">{earliestShift.notes}</td>
            <td className="text-center">
              {earliestShift.shift_type === "giveaway"
                ? 0
                : shifts.reduce(
                    (total, shift) =>
                      total + (shift.worked_hours - shift.lunch_break),
                    0,
                  )}
            </td>
            <td className="text-center">{date}</td>
            <td
              style={{
                color: earliestShift.shift_type === "giveaway" ? "red" : "#333",
              }}
            >
              {earliestShift.shift_type === "giveaway"
                ? `$0.00`
                : `$${totalDailyEarnings.toFixed(2)}`}
            </td>
            <td>
              {hasMultiple ? (
                <span
                  className="text-center border border-1  rounded-3 p-1 bg-light"
                  style={{
                    display: "inline-block",
                    width: "100%",
                    cursor: "pointer",
                  }}
                  onClick={() => handleInfoClick(date, shifts)}
                >
                  <IoMdInformationCircleOutline
                    size={21}
                    className="cursor-pointer me-1"
                  />
                  Multiple Shifts
                </span>
              ) : (
                <span
                  className={`py-1 px-3 border rounded-3 text-white text-center ${
                    ["vacation", "holiday", "giveaway"].includes(
                      earliestShift.shift_type,
                    ) || earliestShift.is_completed
                      ? "bg-primary"
                      : "bg-secondary"
                  } ${
                    ["vacation", "holiday", "giveaway"].includes(
                      earliestShift.shift_type,
                    )
                      ? "disabled"
                      : ""
                  }`}
                  data-bs-toggle={
                    [].includes(earliestShift?.shift_type) ? undefined : "modal"
                  }
                  data-bs-target={
                    [].includes(earliestShift?.shift_type)
                      ? undefined
                      : "#shiftModal"
                  }
                  onClick={() => handleStatusClick(earliestShift)}
                  style={{
                    cursor: "default",
                    display: "inline-block",
                    width: "100%",
                    cursor: "pointer",
                  }}
                >
                  {earliestShift.is_completed ? "completed" : "scheduled"}
                </span>
              )}
            </td>
          </tr>
        ),
      )}
      <tr className="table-info">
        <td className="text-end " colSpan={8}>
          <strong>Total Period Earnings: </strong>$
          {totalEarnings.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </td>
      </tr>
    </>
  );
};

export default ShiftData;
