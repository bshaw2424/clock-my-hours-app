interface SelectValues {
  selectName: string;
  value: string;
  numberRange: number;
  menuTitle: string;
}

const SelectForm = ({
  selectName,
  value,
  numberRange,
  menuTitle,
}: SelectValues) => {
  return (
    <select name={selectName} id={selectName}>
      <option value={value} selected disabled>
        {menuTitle}
      </option>
      {Array.from({ length: numberRange }, (_, i) => (
        <option key={i} value={i}>
          {i < 10 ? "0" + i : i}
        </option>
      ))}
    </select>
  );
};

export default SelectForm;
