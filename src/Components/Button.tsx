interface Buttons {
  children: string;
  buttonType?: "submit" | "reset";
  className: string;
}

const Button = ({ children, buttonType, className }: Buttons) => {
  return (
    <div className="button-container">
      <button type={buttonType} className={className}>
        {children}
      </button>
    </div>
  );
};

export default Button;
