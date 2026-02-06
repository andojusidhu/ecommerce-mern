import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>

      <div className="admin-actions">
        <button onClick={() => navigate("/admin/add-product")}>➕ Add Product</button>
        <button onClick={() => navigate("/admin/manage-products")}>🛠 Manage Products</button>
        <button onClick={() => navigate("/admin/orders")}>📦 Orders</button>
        <button onClick={() => navigate("/admin/users")}>👥 Users</button>
      </div>
    </div>
  );
}
