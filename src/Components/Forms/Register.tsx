import Button from "../Button";

const Register = () => {
  return (
    <div className="register-form border border-1 p-4 rounded-3 w-75 bg-white">
      <h1>Start Tracking Your Hours!</h1>
      <form action="">
        <input
          className="form-control"
          type="text"
          name="username"
          id="username"
          placeholder="Username"
        />

        <input
          className="form-control"
          type="email"
          name="email"
          id="email"
          placeholder="Email"
        />

        <input
          className="form-control"
          type="password"
          name="password"
          id="password"
          placeholder="Password"
        />

        <input
          className="form-control"
          type="password"
          name="confirm"
          id="confirm"
          placeholder="Confirm Password"
        />

        <Button buttonType="submit" className="btn btn-primary w-100 p-3">
          Create Account
        </Button>
      </form>
    </div>
  );
};

export default Register;
