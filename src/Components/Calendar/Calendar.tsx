import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

const Calendar = () => {
  return (
    <section>
      <div className="my-5" style={{ display: "none" }}>
        <h1 className="text-center border border-1 border-black mb-3 py-2">
          Work Schedule
        </h1>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            start: "today prev, next",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height={650}
        />
      </div>
    </section>
  );
};

export default Calendar;
