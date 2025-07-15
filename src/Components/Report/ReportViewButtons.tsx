const ReportViewButtons = ({ handleExportCSV, handleExportPDF }) => {
  return (
    <div className="no-print my-4">
      <button
        className="btn btn-outline-secondary me-2 no-print"
        onClick={handleExportCSV}
      >
        Export Report as CSV
      </button>
      <button
        className="btn btn-outline-secondary me-2 no-print"
        onClick={handleExportPDF}
      >
        View Report as PDF
      </button>
    </div>
  );
};

export default ReportViewButtons;
