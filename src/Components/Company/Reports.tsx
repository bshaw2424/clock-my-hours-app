import { useParams } from "react-router-dom";
import { useCompany } from "../../Context/CompanyContext";

const Reports = () => {
  const { slug } = useParams();
  const { companyData } = useCompany();
  const findCompany = companyData.find(company => company?.slug === slug);
  return (
    <section className="container">
      <div className="row">
        <h1>{findCompany?.name}</h1>
      </div>
    </section>
  );
};

export default Reports;
