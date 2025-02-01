import { useEffect, useState } from "react";

interface Event {
  title: string;
  start: string;
  end: string;
}

interface Events {
  selectedDate: string;
  selectedEvents: Event[]; // Include selectedEvents
}

const EventModal = ({ selectedEvents, selectedDate }: Events) => {
  const [modalContent, setModalContent] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");

  useEffect(() => {
    if (selectedEvents.length > 0) {
      setModalTitle(`Events on ${selectedDate}`);
      setModalContent(
        selectedEvents
          .map(e => `${e.title} - ${e.start.slice(11)} to ${e.end.slice(11)}`)
          .join("\n"),
      );

      // Show Bootstrap modal
      const modal = new window.bootstrap.Modal(
        document.getElementById("exampleModal") as HTMLElement,
      );
      modal.show();
    } else {
      alert(`No events on ${selectedDate}`);
    }
  }, [selectedEvents, selectedDate]);

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {modalTitle}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <pre>{modalContent}</pre>
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
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
