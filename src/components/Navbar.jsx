import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="bottom-navbar">
      <Link to="/" className="nav-item">Home</Link>
      <Link to="/categories" className="nav-item">Menu</Link>
      <Link to="/orders" className="nav-item">Orders</Link>
      <Link to="/login" className="nav-item auth">Sign Up / Login</Link>
    </nav>
  );
};

export default Navbar;
