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
                      <br />
                      Status: {!shift.is_completed ? "scheduled" : "completed"}
                      <div className="mt-3">
                        <button
                          type="submit"
                          className="btn btn-outline-danger"
                          onClick={() => deleteShift(shift.id)}
                        >
                          Delete
                        </button>
                        <Link to={""} className="btn btn-outline-primary ms-3">
                          <BiSolidEditAlt />
                        </Link>
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

export default ShiftModal;
