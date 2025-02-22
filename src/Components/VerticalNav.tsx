import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { MdSettings, MdBusiness } from "react-icons/md";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { MdOutlineBusinessCenter } from "react-icons/md";
import Logout from "./Logout";

const VerticalNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [companiesOpen, setCompaniesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Check screen size for mobile/tablet
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCompaniesDropdown = () => {
    setCompaniesOpen(!companiesOpen);
  };

  const toggleSettingsDropdown = () => {
    setSettingsOpen(!settingsOpen);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // Implement logout logic here
  };

  return (
    <>
      {/* Sidebar (Mobile = Sliding | Desktop = Fixed) */}
      <div
        className={`sidebar ${
          isMobile ? (isOpen ? "open" : "collapsed") : "desktop"
        } pt-5`}
      >
        {isMobile && (
          <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <IoClose size={20} /> : <RxHamburgerMenu size={20} />}
          </button>
        )}
        <ul>
          <li>
            <Link to="/newCompany">
              <MdBusiness size={24} />
              {isOpen || !isMobile ? <span>Add Company</span> : null}
            </Link>
          </li>

          {/* Companies Dropdown (WITH Arrow) */}
          <li className="w-100">
            {isOpen || !isMobile ? (
              <div className="w-100">
                <div
                  className="w-100 py-2"
                  onClick={toggleCompaniesDropdown}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {companiesOpen ? (
                    <IoMdArrowDropdown size={20} />
                  ) : (
                    <IoMdArrowDropup size={20} />
                  )}
                  <span style={{ marginLeft: "5px" }}>Companies</span>
                </div>
                <ul className={`dropdown ${companiesOpen ? "open" : ""}`}>
                  <li>Southwest</li>
                </ul>
              </div>
            ) : (
              <MdOutlineBusinessCenter size={25} />
            )}
          </li>

          {/* Settings Dropdown (WITHOUT Arrow) */}
          <li className="w-100">
            {isOpen || !isMobile ? (
              <div className="w-100">
                <div
                  className=" w-100 py-2"
                  onClick={toggleSettingsDropdown}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <MdSettings size={24} />
                  <span style={{ marginLeft: "5px" }}>Settings</span>
                </div>
                <ul className={`dropdown ${settingsOpen ? "open" : ""}`}>
                  <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                    <Logout />
                  </li>
                </ul>
              </div>
            ) : (
              <MdSettings size={25} />
            )}
          </li>
        </ul>
      </div>

      {/* Styles for Dropdown Animation */}
      <style>
        {`
          .dropdown {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-in-out;
          }

          .dropdown.open {
            max-height: 50px; /* Adjust based on content */
          }
        `}
      </style>
    </>
  );
};

export default VerticalNav;
