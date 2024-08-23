import { useState } from "react";

const RadioButton = () => {
  const [buttonOption, setButtonOption] = useState<string>("");
  const [buttonState, setButtonState] = useState<boolean>(false);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setButtonOption(event.target.value);
    if (event.target.value === "overtime") {
      setButtonState(true);
    }
    if (event.target.value === "regular") {
      setButtonState(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        <label htmlFor="regular" className="pe-1">
          Regular
        </label>
        <input
          className="me-2"
          type="radio"
          name="shiftType"
          value="regular"
          id="regular"
          onChange={handleRadioChange}
        />
        <label htmlFor="overtime" className="pe-1">
          Overtime
        </label>
        <input
          type="radio"
          name="shiftType"
          id="overtime"
          value="overtime"
          onChange={handleRadioChange}
        />
      </div>
      {buttonOption === "overtime" && buttonState === true && (
        <div className="mt-2 d-flex justify-content-center  p-1">
          <select name="overtimeType" id="overtime" className="w-100">
            <option value="default" className="text-center" disabled selected>
              Overtime Rate
            </option>
            <option value="timeHalf">Time / Half</option>
            <option value="double">Double</option>
            <option value="triple">Triple</option>
          </select>
        </div>
      )}
    </>
  );
};

export default RadioButton;
