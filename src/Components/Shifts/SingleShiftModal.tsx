import { Link } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const SingleShiftModal = ({ shiftData, selectedShift, shiftId }) => {
  const [shiftStatus, setShiftStatuss] = useState(null);

  const shiftDetails = selectedShift
    .flatMap(a => a.shifts)
    .find(shifts => shifts.id === shiftId);

  useEffect(() => {
    const updateShift = axios.get();
  }, []);

  return (
    <>
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
              {shiftData ? (
                <>
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <p className="mb-3" style={{ fontSize: "1.3rem" }}>
                      {shiftDetails?.start_time} - {shiftDetails?.end_time}
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
                          shiftDetails?.shift_type === "giveaway" &&
                          "text-danger"
                        }`}
                      >
                        {shiftDetails?.shift_type === "giveaway"
                          ? shiftDetails?.worked_hours -
                            shiftDetails.lunch_break
                          : shiftDetails?.worked_hours -
                            shiftDetails?.lunch_break}
                      </span>
                    </h2>
                  </div>
                  <div className="d-flex justify-content-center align-items-center my-3">
                    <div>
                      <p className="m-0">
                        <strong>Type:</strong> {shiftDetails?.shift_type}
                      </p>
                      <p className="m-0">
                        <strong>Notes:</strong> {shiftDetails?.notes}
                      </p>
                      <strong>Status: </strong>
                      {shiftDetails?.is_completed ? "completed" : "scheduled"}
                    </div>
                  </div>
                </>
              ) : (
                <p>Loading shift details...</p>
              )}
            </div>
            {!shiftDetails?.is_completed ? (
              <div className="mb-4 d-flex justify-content-center align-items-center">
                <button
                  type="submit"
                  className="btn btn-outline-danger"
                  onClick={() => deleteShift(shiftDetails?.id)}
                >
                  Delete
                </button>

                <span
                  className="btn btn-outline-info ms-3 me-3"
                  style={{ cursor: "pointer" }}
                >
                  <Link
                    to={`/schedule/${shiftDetails?.company_name}/update/shift/${shiftDetails?.id}`}
                    onClick={() => {
                      const modalEl = document.getElementById("shiftModal");
                      const modal = bootstrap.Modal.getInstance(modalEl);
                      modal.hide();
                    }}
                  >
                    Edit <BiSolidEditAlt />
                  </Link>
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleShiftModal;
