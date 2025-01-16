import { Link } from "react-router-dom";

const VerticalNav = () => {
  return (
    <nav style={{ height: "100vh", width: "10rem" }}>
      <div className="pt-3" style={{ height: "100%" }}>
        <ul
          className="border border-1 border-dark p-2"
          style={{ width: "100%", height: "100%" }}
        >
          <li>
            <Link to="/newCompany">Add Company</Link>
          </li>
          <li>Company</li>
          <li>Settings</li>
        </ul>
      </div>
    </nav>
  );
};

export default VerticalNav;
