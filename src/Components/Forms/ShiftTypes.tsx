interface ShiftData {
  startTime: string;
  endTime: string;
  shiftType: string;
  lunchBreak: string;
  notes: string;
  workDate: string;
}

interface ShiftDataTypes {
  shiftData: ShiftData;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ShiftTypes = ({ shiftData, handleChange }: ShiftDataTypes) => {
  return (
    <div>
      <select
        className="form-select form-control"
        name="shiftType"
        value={shiftData.shiftType}
        onChange={handleChange}
        required
      >
        <option value="" disabled>
          Shift Type
        </option>
        <option value="regular">Regular</option>
        <option value="overtime">Overtime</option>
        <option value="sick">Sick</option>
        <option value="vacation">Vacation</option>
        <option value="holiday">Holiday</option>
      </select>
    </div>
  );
};

export default ShiftTypes;
