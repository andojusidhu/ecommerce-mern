import "./Register.css";

const Register = () => {
  return (
    <div className="register">
      <h2>Register</h2>
      <input placeholder="Name" />
      <input placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button>Register</button>
    </div>
  );
};

export default Register;
