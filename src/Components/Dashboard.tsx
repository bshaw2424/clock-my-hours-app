import VerticalNav from "./VerticalNav";
import Calendar from "./Calendar/Calendar";

const Dashboard = () => {
  return (
    <div style={{ minHeight: "100vh" }} className="container">
      <section
        className=""
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 4fr 2fr",
          gap: "10px",
        }}
      >
        <VerticalNav />
        <Calendar />
        <div className="d-flex flex-column">
          <div className="border border-1 border-dark h-50">dfjdf</div>
          <div className="border border-1 border-dark h-50">dfadf</div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
