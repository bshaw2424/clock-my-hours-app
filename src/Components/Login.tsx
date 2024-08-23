const Login = () => {
  return (
    <div
      className="d-flex flex-column w-100 h-100 border border-3 justify-content-center align-items-center ms-5"
      style={{ height: "100vh" }}
    >
      <div className="d-flex flex-column align-items-center justify-content-center">
        <h1 className="">Login</h1>
        <form className=" d-flex flex-column">
          <input
            type="text"
            name="login-username"
            id="login-username"
            placeholder="Enter Username"
          />
          <input
            type="password"
            name="login-password"
            id="login-password"
            placeholder="Enter Password"
          />
          <div className="button-container">
            <button>Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
