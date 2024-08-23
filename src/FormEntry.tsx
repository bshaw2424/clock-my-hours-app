import SelectForm from "./SelectForm";

interface FormInput {
  inputName: string;

  title: string;
}
const rangeOfHours: number = 24;
const rangeOfMinutes: number = 60;

const FormEntry = ({ inputName, title }: FormInput) => {
  return (
    <>
      <div className="create-shift-form shadow-sm rounded">
        <h3 className="text-center">{title}</h3>

        <div className="d-flex justify-content-center">
          <div className="me-2">
            <input type="date" name={inputName} id={inputName} />
          </div>
          <div className="me-2">
            <SelectForm
              selectName="startTime"
              value="Hour"
              numberRange={rangeOfHours}
              menuTitle="Hours"
            />
          </div>
          {" : "}
          <div className="ms-2">
            <SelectForm
              selectName="End Time"
              value="minute"
              numberRange={rangeOfMinutes}
              menuTitle="Min"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FormEntry;
