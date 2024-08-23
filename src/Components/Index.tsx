import Register from "./Forms/Register";

const Index = () => {
  return (
    <section
      className="d-flex border border-1 w-100 p-5"
      style={{ backgroundColor: "#f4f4f4" }}
    >
      <div className="description w-100 flex-center flex-column">
        <h2>Create Beautiful mobile friendly templates</h2>
        <p>section text</p>
      </div>
      <Register />
    </section>
  );
};

export default Index;
