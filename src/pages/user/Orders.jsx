import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editData, setEditData] = useState({});
  const [errorMessage, setErrorMessage] = useState(""); // new state for errors
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("You are not logged in. Please log in to see orders.");
      return navigate("/login");
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/my-orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // Handle 400/500 errors
        console.error("Server error:", data.message || data);
        setErrorMessage(
          data.message || "Failed to load orders. Backend may have an issue."
        );
        setOrders([]); // prevent crash
        return;
      }

      if (!Array.isArray(data)) {
        // Sometimes backend returns an object instead of array
        setOrders([]);
        setErrorMessage("No orders found or invalid response from server.");
        return;
      }

      setOrders(data);
      setErrorMessage(""); // clear previous errors
    } catch (err) {
      console.error("Fetch error:", err);
      setErrorMessage(
        "Unable to fetch orders. Please check your connection or try again later."
      );
      setOrders([]);
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Cancelled" }),
      });

      const updated = await res.json();

      if (!res.ok) {
        alert(updated.message || "Cancel failed");
        return;
      }

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ delivery: editData }),
      });

      const updated = await res.json();

      if (!res.ok) {
        alert(updated.message || "Update failed");
        return;
      }

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

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {!errorMessage && orders.length === 0 && <p>No orders found</p>}

      {!errorMessage &&
        Array.isArray(orders) &&
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
                <p>{order.delivery?.house || "-"}</p>
                <p>{order.delivery?.city || "-"}</p>
                <p>{order.delivery?.pincode || "-"}</p>
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
