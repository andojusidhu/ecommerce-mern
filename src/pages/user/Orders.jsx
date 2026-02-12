import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/my-orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      // Ensure orders is always an array
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load orders. Backend may not be deployed yet.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // 🗑 Delete Order
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (!confirmDelete) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  // 🚫 Cancel Order
  const handleCancel = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Cancelled" }),
        }
      );

      const updated = await res.json();

      setOrders((prev) =>
        prev.map((order) => (order._id === id ? updated : order))
      );
    } catch (err) {
      alert("Cancel failed");
    }
  };

  // ✏ Update Delivery
  const handleUpdate = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ delivery: editData }),
        }
      );

      const updated = await res.json();

      setOrders((prev) =>
        prev.map((order) => (order._id === id ? updated : order))
      );

      setEditingOrderId(null);
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="orders-container">
      <h2>My Orders</h2>

      {loading && <p>Loading orders...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {Array.isArray(orders) && orders.length === 0 && !loading && !error && (
        <p>No orders found</p>
      )}

      {Array.isArray(orders) &&
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <h3>Order ID: {order._id}</h3>
            <p>Total: ₹{order.totalAmount}</p>
            <p>
              Status:{" "}
              <span className={`status ${order.status}`}>{order.status}</span>
            </p>

            <h4>Delivery Details</h4>

            {editingOrderId === order._id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editData.house || ""}
                  placeholder="House"
                  onChange={(e) =>
                    setEditData({ ...editData, house: e.target.value })
                  }
                />
                <input
                  type="text"
                  value={editData.city || ""}
                  placeholder="City"
                  onChange={(e) =>
                    setEditData({ ...editData, city: e.target.value })
                  }
                />
                <input
                  type="text"
                  value={editData.pincode || ""}
                  placeholder="Pincode"
                  onChange={(e) =>
                    setEditData({ ...editData, pincode: e.target.value })
                  }
                />

                <button
                  className="save-btn"
                  onClick={() => handleUpdate(order._id)}
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <p>{order.delivery?.house}</p>
                <p>{order.delivery?.city}</p>
                <p>{order.delivery?.pincode}</p>
              </>
            )}

            <div className="order-buttons">
              {order.status === "Pending" && (
                <>
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingOrderId(order._id);
                      setEditData(order.delivery || {});
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="cancel-btn"
                    onClick={() => handleCancel(order._id)}
                  >
                    Cancel
                  </button>
                </>
              )}

              <button
                className="delete-btn"
                onClick={() => handleDelete(order._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
