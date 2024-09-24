import Register from "./Forms/Register";
import Features from "./Features/Features";
// import Nav from "./Nav";

const Index = () => {
  return (
    <>
      {/* <Nav /> */}
      <header
        className="d-flex border border-1 w-100 py-5"
        style={{ background: "rgba(51,51,51, .9)" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-lg-6">
              <article className="description w-100 h-100">
                <div className="d-flex flex-column justify-content-center h-100 text-white">
                  <h2>Track Your Hours for Peace of Mind</h2>
                  <p className="mb-0">
                    Effortlessly monitor and manage your hours independently.
                  </p>
                  <p className="p-0">
                    Avoid discrepancies and ensure accuracy with clear, reliable
                    records that keep you in control and stress-free.
                  </p>
                </div>
              </article>
            </div>
            <div className="col-sm-12 col-lg-6">
              <Register />
            </div>
          </div>
        </div>
      </header>
      <main className="container py-5">
        <Features />
      </main>
    </>
  );
};

export default Index;
