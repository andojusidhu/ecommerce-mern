import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editData, setEditData] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect unauthenticated users to login/signup
      navigate("/login", { replace: true });
      return;
    }

    fetchOrders(token);
  }, []);

  const fetchOrders = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(data.message || "Failed to load orders. Server returned an error.");
        setOrders([]);
        return;
      }

      if (!Array.isArray(data)) {
        setErrorMsg("Unexpected data format received from server.");
        setOrders([]);
        return;
      }

      setOrders(data);
      setErrorMsg("");
    } catch (err) {
      console.error("Fetch failed:", err);
      setErrorMsg("Failed to fetch orders. Check your network or try again later.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete Order
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  // Cancel Order
  const handleCancel = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Cancelled" }),
      });

      if (!res.ok) throw new Error("Cancel failed");

      const updated = await res.json();
      setOrders((prev) =>
        prev.map((order) => (order._id === id ? updated : order))
      );
    } catch (err) {
      alert(err.message || "Cancel failed");
    }
  };

  // Update Delivery
  const handleUpdate = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ delivery: editData }),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setOrders((prev) =>
        prev.map((order) => (order._id === id ? updated : order))
      );
      setEditingOrderId(null);
    } catch (err) {
      alert(err.message || "Update failed");
    }
  };

  return (
    <div className="orders-container">
      <h2>My Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : errorMsg ? (
        <p className="error-msg">{errorMsg}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
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

            <h4>Items</h4>
            {order.items?.map((item) => (
              <div key={item.productId} className="cart-item">
                <img
                  src={item.image || "https://via.placeholder.com/60"}
                  alt={item.name}
                />
                <div className="cart-info">
                  <p>{item.name}</p>
                  <p>
                    ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                  </p>
                  {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                  {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                </div>
              </div>
            ))}

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
        ))
      )}
    </div>
  );
}
