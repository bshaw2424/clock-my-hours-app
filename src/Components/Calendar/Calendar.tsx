import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
import EventModal from "../Modal";
import NewShift from "../Forms/NewShift";
// import { useCompany } from "../../Context/CompanyContext";

interface Event {
  title: string;
  start: string;
  end: string;
}

interface CompanyTitle {
  company_title: string;
}

const Calendar = ({ company_title }: CompanyTitle) => {
  // const { companyData, selectedCompany, setSelectedCompany } = useCompany();

  console.log("hellloooo " + company_title);
  const [events, setEvents] = useState<Event[]>([]);
  // [
  //   {
  //     title: "Overnight Shift",
  //     start: "2025-01-30T23:00:00",
  //     end: "2025-01-31T07:30:00",
  //   },
  //   {
  //     title: "Lunch Break",
  //     start: "2025-01-15T12:30:00",
  //     end: "2025-01-15T13:30:00",
  //   },
  //   {
  //     title: "Afternoon Call",
  //     start: "2025-01-30T15:00:00",
  //     end: "2025-01-30T16:00:00",
  //   },
  // ];
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleDateSelect = (selectInfo: string) => {
    const selectedDate = selectInfo.startStr.split("T")[0];
    setSelectedDate(selectedDate);

    // Filter events based on selected date
    const eventsForDate = events.filter(
      event => event.start.split("T")[0] === selectedDate,
    );
    setSelectedEvents(eventsForDate);
  };

  return (
    <section className="mt-5 p-0">
      <div className="m-3">
        {!showForm ? (
          <div>
            <div className="mb-5 d-flex">
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn btn-primary w-25"
              >
                Add Shift
              </button>
              <h1 className="bg-grey w-100 text-center p-0">{company_title}</h1>
            </div>

            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                start: "today prev,next",
                center: "title",
                end: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              selectable={true}
              select={handleDateSelect}
              height={600}
              events={events}
            />
          </div>
        ) : (
          <NewShift title={company_title} showForm={setShowForm} />
        )}
        {/* Render Event Modal Only When a Date is Selected */}
        {selectedDate && (
          <EventModal
            selectedEvents={selectedEvents}
            selectedDate={selectedDate}
          />
        )}
      </div>
    </section>
  );
};

export default Calendar;
