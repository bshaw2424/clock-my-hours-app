import { useEffect, useState } from "react";
import { useCompany } from "../../Context/CompanyContext";
import { Link, useParams } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Reports = () => {
  const { companyData } = useCompany();
  const { slug } = useParams();
  const getCompany = companyData.find(company => company?.slug === slug);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [companyPayRate, setCompanyPayRate] = useState();
  const [shiftData, setShiftData] = useState([]);

  const goToPreviousMonth = () => {
    setMonth(prev => (prev === 0 ? (setYear(y => y - 1), 11) : prev - 1));
  };

  const goToNextMonth = () => {
    setMonth(prev => (prev === 11 ? (setYear(y => y + 1), 0) : prev + 1));
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    setMonth(now.getMonth());
    setYear(now.getFullYear());
  };

  useEffect(() => {
    const getCompanyShiftData = async () => {
      const res = await axios.get("http://localhost:8000/shifts/", {
        withCredentials: true,
      });
      const allShifts = res?.data.shifts || [];
      const companyShifts = allShifts.filter(
        shift => shift.company_id === getCompany?.id,
      );
      setShiftData(companyShifts);
    };

    if (getCompany?.id) getCompanyShiftData();
  }, [getCompany?.id]);

  useEffect(() => {
    const getCompanyData = async () => {
      const res = await axios.get(
        `http://localhost:8000/companies/${getCompany?.id}/details/`,
        { withCredentials: true },
      );
      setCompanyPayRate(res?.data?.data[0]?.pay_rate);
    };

    if (getCompany?.id) getCompanyData();
  }, [getCompany?.id]);

  const filteredShifts = shiftData.filter(shift => {
    const [workYear, workMonth] = shift.work_date.split("-").map(Number);
    return workYear === year && workMonth - 1 === month;
  });

  const getMultiplier = type => {
    switch (type) {
      case "timeHalf":
        return 1.5;
      case "double":
        return 2;
      case "triple":
        return 3;
      default:
        return 1;
    }
  };

  const groupShiftsByPayPeriod = (
    shifts,
    payFrequency,
    payPeriodStart,
    payPeriodEnd,
  ) => {
    const groups = {};
    shifts.forEach(shift => {
      const [year, m, day] = shift.work_date.split("-").map(Number);
      const date = new Date(year, m - 1, day);
      let key = "";

      switch (payFrequency) {
        case "weekly":
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - weekStart.getDay());
          key = `Week of ${weekStart.toISOString().split("T")[0]}`;
          break;
        case "biweekly":
          const anchor = new Date(year, 0, 1);
          const diffInDays = Math.floor(
            (date - anchor) / (1000 * 60 * 60 * 24),
          );
          const biweekNum = Math.floor(diffInDays / 14);
          const biweekStart = new Date(anchor);
          biweekStart.setDate(anchor.getDate() + biweekNum * 14);
          key = `Biweekly starting ${biweekStart.toISOString().split("T")[0]}`;
          break;
        case "semi-monthly":
        case "semi-monthly-custom":
          if (day >= payPeriodStart && day <= payPeriodEnd) {
            key = `Pay Period ${payPeriodStart}–${payPeriodEnd} ${
              months[m - 1]
            } ${year}`;
          } else {
            const nextStart = payPeriodEnd + 1;
            const lastDay = new Date(year, m, 0).getDate();
            key = `Pay Period ${nextStart}–${lastDay} ${months[m - 1]} ${year}`;
          }
          break;
        case "monthly":
        default:
          key = `${months[m - 1]} ${year}`;
          break;
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(shift);
    });

    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => new Date(a.work_date) - new Date(b.work_date));
    });

    return groups;
  };

  const groupedShifts = groupShiftsByPayPeriod(
    filteredShifts,
    getCompany?.pay_frequency || "monthly",
    getCompany?.pay_period_start || 1,
    getCompany?.pay_period_end || 15,
  );

  const isCurrentMonthYear =
    month === currentDate.getMonth() && year === currentDate.getFullYear();

  const handleExportCSV = () => {
    const rows = [
      [
        "Pay Period",
        "Date",
        "Time",
        "Worked Hours",
        "Type",
        "Rate",
        "Earned",
        "Notes",
      ],
    ];

    Object.entries(groupedShifts).forEach(([periodLabel, shifts]) => {
      shifts.forEach(shift => {
        const multiplier = getMultiplier(shift.shift_type);
        const earned = (
          shift.worked_hours *
          companyPayRate *
          multiplier
        ).toFixed(2);
        rows.push([
          periodLabel,
          shift.work_date,
          `${shift.start_time}–${shift.end_time}`,
          shift.worked_hours,
          shift.shift_type,
          `$${companyPayRate?.toFixed(2)}`,
          `$${earned}`,
          shift.notes || "",
        ]);
      });
    });

    const csv =
      "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute(
      "download",
      `${getCompany?.name}_Report_${months[month]}_${year}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${getCompany?.name} Report - ${months[month]} ${year}`, 14, 20);

    let y = 30;

    Object.entries(groupedShifts).forEach(([periodLabel, shifts]) => {
      doc.setFontSize(12);
      doc.text(periodLabel, 14, y);
      y += 6;

      const rows = shifts.map(shift => {
        const multiplier = getMultiplier(shift.shift_type);
        const earned = (
          shift.worked_hours *
          companyPayRate *
          multiplier
        ).toFixed(2);
        return [
          shift.work_date,
          `${shift.start_time}–${shift.end_time}`,
          shift.worked_hours,
          shift.shift_type,
          `$${companyPayRate?.toFixed(2)}`,
          `$${earned}`,
          shift.notes || "",
        ];
      });

      doc.autoTable({
        head: [["Date", "Time", "Hours", "Type", "Rate", "Earned", "Notes"]],
        body: rows,
        startY: y,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 9 },
      });

      y = doc.lastAutoTable.finalY + 10;
    });

    doc.save(`${getCompany?.name}_Report_${months[month]}_${year}.pdf`);
  };

  const renameShiftTitle = shift_title => {
    if (shift_title === "timeHalf") {
      return "Overtime - Time 1/2";
    } else if (shift_title === "double") {
      return "Overtime - X2";
    } else if (shift_title === "triple") {
      return "Overtime - X3";
    } else {
      return shift_title;
    }
  };

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-12 mb-3 mt-4 border-bottom border-2">
            <h1>
              <Link to={`/dashboard/${slug}`}>{getCompany?.name}</Link>
            </h1>
          </div>
          <div className="col-auto mb-3 d-flex align-items-center">
            <button
              className="btn btn-outline-primary me-2"
              onClick={goToPreviousMonth}
            >
              <FaChevronLeft />
            </button>
            <span style={{ margin: "0 1rem", fontSize: "1.7rem" }}>
              {months[month]} {year}
            </span>
            <button
              className="btn btn-outline-primary ms-2"
              onClick={goToNextMonth}
            >
              <FaChevronRight />
            </button>
            {!isCurrentMonthYear && (
              <button
                onClick={goToCurrentMonth}
                className="btn btn-primary ms-3"
              >
                Current Month
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mt-4">
        {Object.keys(groupedShifts).length > 0 ? (
          Object.entries(groupedShifts).map(([periodLabel, shifts]) => {
            const totalEarned = shifts.reduce((total, shift) => {
              if (shift.shift_type === "giveaway") shift.worked_hours = 0;
              return (
                total +
                shift.worked_hours *
                  companyPayRate *
                  getMultiplier(shift.shift_type)
              );
            }, 0);

            return (
              <div key={periodLabel} className="mb-5">
                <h5 className="text-primary">{periodLabel}</h5>
                <h6 className="text-muted">
                  Total Earned: ${totalEarned.toFixed(2)}
                </h6>
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Start – End Time</th>
                      <th>Worked Hours</th>
                      <th>Shift Type</th>
                      <th>Pay Rate</th>
                      <th>Amount Earned</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shifts.map(shift => {
                      const multiplier = getMultiplier(shift.shift_type);
                      const earned = (
                        shift.shift_type === "giveaway"
                          ? 0
                          : shift.worked_hours * companyPayRate * multiplier
                      ).toFixed(2);
                      return (
                        <tr key={shift.id}>
                          <td>{shift.work_date}</td>
                          <td>
                            {shift.start_time} – {shift.end_time}
                          </td>
                          <td>{shift.worked_hours}</td>
                          <td>{renameShiftTitle(shift?.shift_type)}</td>
                          <td>
                            {shift.shift_type === "giveaway"
                              ? "$0.00"
                              : (() => {
                                  let multiplier = 1;
                                  if (shift.shift_type === "timeHalf")
                                    multiplier = 1.5;
                                  else if (shift.shift_type === "double")
                                    multiplier = 2;
                                  else if (shift.shift_type === "triple")
                                    multiplier = 3;

                                  const adjustedRate =
                                    (companyPayRate || 0) * multiplier;
                                  return `$${adjustedRate.toFixed(2)}`;
                                })()}
                          </td>
                          <td>${earned}</td>
                          <td>{shift.notes || "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>

                  <div className="mt-3">
                    <Link className="btn btn-primary btn-sm" to={""}>
                      Detail View
                    </Link>
                  </div>
                </table>
              </div>
            );
          })
        ) : (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "80vh" }}
          >
            <h3 className="h-100 w-100 d-flex align-items-center justify-content-center">
              No shifts recorded for {months[month]} {year}.
            </h3>
          </div>
        )}

        {/* ✅ Monthly Total */}
        {filteredShifts.length > 0 && (
          <div className="mb-4">
            <h5 className="text-end">
              Total Earned in {months[month]} {year}:{" "}
              <span className="text-success">
                $
                {filteredShifts
                  .reduce((total, shift) => {
                    if (shift.shift_type === "giveaway") return total;
                    const multiplier = getMultiplier(shift.shift_type);
                    return (
                      total + shift.worked_hours * companyPayRate * multiplier
                    );
                  }, 0)
                  .toFixed(2)}
              </span>
            </h5>
          </div>
        )}

        {/* ✅ Buttons */}
        {filteredShifts.length > 0 && (
          <div className="mb-5">
            <button
              className="btn btn-outline-secondary me-2"
              onClick={handleExportCSV}
            >
              Export Report as CSV
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={handleExportPDF}
            >
              View Report as PDF
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reports;
