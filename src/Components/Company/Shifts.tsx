import { RiDeleteBin2Line } from "react-icons/ri";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useState } from "react";

const Shifts = ({ companyShifts, selectedCompanyId }) => {
  const [sortAsc, setSortAsc] = useState(true);

  const toggleSort = () => {
    setSortAsc(prev => !prev);
  };

  const filteredShifts = companyShifts
    .filter(company => company.company_id === selectedCompanyId)
    .sort((a, b) => {
      return sortAsc
        ? new Date(a.work_date) - new Date(b.work_date)
        : new Date(b.work_date) - new Date(a.work_date);
    });

  return (
    <table className="table table-striped">
      <thead className="border border-1 table-dark">
        <tr>
          <th scope="col">Start Time</th>
          <th scope="col">End Time</th>
          <th scope="col">Shift Type</th>
          <th scope="col">Notes</th>
          <th scope="col" onClick={toggleSort} style={{ cursor: "pointer" }}>
            Date {sortAsc ? "↑" : "↓"}
          </th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredShifts.map((shift, index) => (
          <tr key={index}>
            <td>{shift.start_time}</td>
            <td>{shift.end_time}</td>
            <td>{shift.shift_type}</td>
            <td>{shift.notes}</td>
            <td>{shift.work_date}</td>
            <td className="d-flex align-items-center justify-content-around">
              <RiDeleteBin2Line size={21} />
              <IoMdInformationCircleOutline size={21} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Shifts;
