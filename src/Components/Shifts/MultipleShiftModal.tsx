import { Link } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";

const ShiftModal = ({
  modalData,
  closeModal,
  calculateEarnings,
  deleteShift,
}) => {
  return (
    <>
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
                    <div
                      key={i}
                      className="mb-2 border border-1 rounded my-2 p-3"
                    >
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <p style={{ fontSize: "1.3rem" }}>
                          {shift.start_time} - {shift.end_time}{" "}
                          <span className="ms-2">
                            <BiSolidEditAlt />
                          </span>
                        </p>
                        <h2
                          className="border border-primary border-5 rounded-circle"
                          style={{
                            width: "150px",
                            height: "150px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            flexDirection: "column",
                          }}
                        >
                          Hours
                          <span
                            className={`${
                              shift.shift_type === "giveaway" && "text-danger"
                            }`}
                          >
                            {shift.shift_type === "giveaway"
                              ? shift.worked_hours - shift.lunch_break
                              : shift.worked_hours - shift.lunch_break}
                          </span>
                        </h2>
                      </div>
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <div>
                          <p className="m-0">
                            <b>Type:</b> {shift.shift_type}
                          </p>
                          <p className="m-0">
                            <b>Notes:</b> {shift.notes}
                          </p>
                          <p className="m-0">
                            <b>Earnings: </b>
                            {shift.shift_type !== "giveaway" ? (
                              `$${calculateEarnings(shift).toFixed(2)}`
                            ) : (
                              <span className="text-danger">
                                {" "}
                                {$`-${calculateEarnings(shift).toFixed(2)}`}
                              </span>
                            )}
                          </p>
                          <p className="m-0">
                            <b>Status: </b>
                            {[
                              "giveaway",
                              "vacation",
                              "sick",
                              "holiday",
                            ].includes(shift.shift_type)
                              ? "completed"
                              : !shift.is_completed
                              ? "scheduled"
                              : "completed"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 d-flex justify-content-center align-items-center">
                        <button
                          type="submit"
                          className="btn btn-outline-danger"
                          onClick={() => deleteShift(shift.id)}
                        >
                          Delete
                        </button>
                        <Link to={""} className="btn btn-outline-primary ms-3">
                          Completed
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShiftModal;
