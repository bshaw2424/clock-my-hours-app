import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
import { Link } from "react-router-dom";
import EventModal from "../Modal";

interface Event {
  title: string;
  start: string;
  end: string;
}

const Calendar = ({ company_title }) => {
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
      <h1 className="text-center my-3 bg-grey">{company_title}</h1>
      <div className="m-3">
        <div className="mb-3">
          <Link to="/newShift" className="btn btn-primary">
            Add Shift
          </Link>
        </div>

        {/* FullCalendar Component */}
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
