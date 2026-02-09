import { useEffect, useState } from "react";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      try {
        let data;
        if (token) {
          const res = await fetch("http://localhost:5000/api/orders/my-orders", {
            headers: { Authorization: `Bearer ${token}` },
          });
          data = await res.json();
        } else {
          const res = await fetch("http://localhost:5000/api/orders");
          data = await res.json();
        }
        setOrders(data);
      } catch (err) {
        console.error("Fetch orders error:", err);
      }
    };

    fetchOrders();
  }, []);

  const handleEdit = (index) => {
    const order = orders[index];
    const item = order.items?.[0] || {};

    setEditingIndex(index);
    setEditForm({
      orderId: order._id,
      productName: item.name || "",
      selectedSize: item.selectedSize || "",
      selectedColor: item.selectedColor || "",
      quantity: item.quantity || 1,
      totalPrice: order.totalAmount || 0,
      delivery: { ...order.delivery },
    });
  };

  const handleSave = async (index) => {
    const orderId = editForm.orderId;
    const updatedOrder = {
      delivery: editForm.delivery,
      items: [
        {
          ...orders[index].items[0],
          name: editForm.productName,
          selectedSize: editForm.selectedSize,
          selectedColor: editForm.selectedColor,
          quantity: editForm.quantity,
          price: editForm.totalPrice,
        },
      ],
      totalAmount: editForm.totalPrice,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedOrder),
      });
      const data = await res.json();

      const updatedOrders = [...orders];
      updatedOrders[index] = data;
      setOrders(updatedOrders);
      setEditingIndex(null);
    } catch (err) {
      console.error("Update order error:", err);
    }
  };

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order, index) => {
        const item = order.items?.[0] || {};
        return (
          <div className="order-card" key={order._id}>
            <div className="order-header">
              {/* Product Image styled like categories */}
              <img
                src={item.product?.images?.[0] || item.image || "/placeholder.png"}
                alt={item.name || "Product"}
                className="order-image"
                style={{
                  width: "220px",
                  height: "220px",
                  borderRadius: "12px",
                  objectFit: "cover",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                }}
              />

              {editingIndex === index ? (
                <div className="order-edit-form">
                  <h3>Edit Product & Delivery Details</h3>
                  <input
                    type="text"
                    value={editForm.productName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, productName: e.target.value })
                    }
                    placeholder="Product Name"
                  />
                  <input
                    type="text"
                    value={editForm.selectedSize}
                    onChange={(e) =>
                      setEditForm({ ...editForm, selectedSize: e.target.value })
                    }
                    placeholder="Size"
                  />
                  <input
                    type="text"
                    value={editForm.selectedColor}
                    onChange={(e) =>
                      setEditForm({ ...editForm, selectedColor: e.target.value })
                    }
                    placeholder="Color"
                  />
                  <input
                    type="number"
                    value={editForm.quantity}
                    onChange={(e) =>
                      setEditForm({ ...editForm, quantity: Number(e.target.value) })
                    }
                    placeholder="Quantity"
                  />
                  <input
                    type="number"
                    value={editForm.totalPrice}
                    onChange={(e) =>
                      setEditForm({ ...editForm, totalPrice: Number(e.target.value) })
                    }
                    placeholder="Total Price"
                  />

                  <h4>Delivery Details</h4>
                  {["name","phone","house","street","city","state","pincode"].map((field) => (
                    <input
                      key={field}
                      type="text"
                      value={editForm.delivery?.[field] || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          delivery: { ...editForm.delivery, [field]: e.target.value },
                        })
                      }
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    />
                  ))}

                  <button className="save-btn" onClick={() => handleSave(index)}>Save</button>
                </div>
              ) : (
                <div className="order-details">
                  <h3>Product Details</h3>
                  <p>Name: {item.name}</p>
                  <p>Size: {item.selectedSize}</p>
                  <p>Color: {item.selectedColor}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Total: ₹{order.totalAmount}</p>

                  <h3>Delivery Details</h3>
                  <p>Name: {order.delivery?.name}</p>
                  <p>Phone: {order.delivery?.phone}</p>
                  <p>House: {order.delivery?.house}</p>
                  <p>Street: {order.delivery?.street}</p>
                  <p>City: {order.delivery?.city}</p>
                  <p>State: {order.delivery?.state}</p>
                  <p>Pincode: {order.delivery?.pincode}</p>

                  <button className="edit-btn" onClick={() => handleEdit(index)}>Edit</button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
