import { Link } from "react-router-dom";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  return (
    <nav className="admin-navbar">
      <h2>Raheem Admin</h2>
      <div>
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/add-product">Add Product</Link>
        <Link to="/admin/products">Products</Link>
        <Link to="/admin/orders">Orders</Link>
        <Link to="/admin/users">Users</Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;
