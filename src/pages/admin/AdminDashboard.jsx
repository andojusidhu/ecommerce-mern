import { Link, useNavigate, useLocation } from "react-router-dom";
import "./AdminDashboard.css";
import { FaUserShield, FaTachometerAlt, FaBoxOpen, FaShoppingBag, FaClipboardList } from "react-icons/fa";

export default function AdminDashboard({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-profile">
          <FaUserShield className="admin-icon" />
          <span className="admin-name">RaheemAdmin</span>
        </div>

        <ul className="nav-links">
          <li className={isActive("/admin/dashboard") ? "active" : ""}>
            <Link to="/admin/dashboard">
              <FaTachometerAlt className="link-icon" /> Dashboard
            </Link>
          </li>
          <li className={isActive("/admin/add-product") ? "active" : ""}>
            <Link to="/admin/add-product">
              <FaBoxOpen className="link-icon" /> Add Product
            </Link>
          </li>
          <li className={isActive("/admin/manage-products") ? "active" : ""}>
            <Link to="/admin/manage-products">
              <FaShoppingBag className="link-icon" /> Manage Products
            </Link>
          </li>
          <li className={isActive("/admin/orders") ? "active" : ""}>
            <Link to="/admin/orders">
              <FaClipboardList className="link-icon" /> Orders
            </Link>
          </li>
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="admin-content">{children}</main>
    </div>
  );
}
