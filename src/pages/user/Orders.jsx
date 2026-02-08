import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({});
  const location = useLocation();

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);

    // Greeting message after order placement
    if (location.state?.justOrdered) {
      alert("Your order has been placed successfully!");
    }
  }, [location.state]);

  const handleEdit = (index) => {
    const order = orders[index];
    const item = order.items?.[0] || {};

    setEditingIndex(index);
    setEditForm({
      productName: item.name || "",
      selectedSize: item.selectedSize || "",
      selectedColor: item.selectedColor || "",
      quantity: item.quantity || 1,
      totalPrice: order.total || 0,
      customerName: order.customer?.name || "",
      street: order.address?.street || "",
      address: order.address?.house || "",
      pincode: order.address?.pincode || "",
    });
  };

  const handleSave = (index) => {
    const updatedOrders = [...orders];
    const existingOrder = updatedOrders[index];

    const updatedOrder = {
      ...existingOrder,
      customer: {
        ...existingOrder.customer,
        name: editForm.customerName,
      },
      address: {
        ...existingOrder.address,
        house: editForm.address,
        street: editForm.street,
        pincode: editForm.pincode,
      },
      total: editForm.totalPrice,
      items: [
        {
          ...existingOrder.items[0],
          name: editForm.productName,
          selectedSize: editForm.selectedSize,
          selectedColor: editForm.selectedColor,
          quantity: editForm.quantity,
        },
      ],
    };

    updatedOrders[index] = updatedOrder;

    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    setEditingIndex(null);
  };

  return (
    <div className="orders-container">
      <h2>My Orders</h2>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order, index) => {
        const item = order.items?.[0] || {};

        return (
          <div className="order-card" key={index}>
            <div className="order-header">
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name || "Product"}
                className="order-image"
              />

              {editingIndex === index ? (
                <div className="order-edit-form">
                  <h3>Edit Product & Delivery Details</h3>

                  <div className="form-group">
                    <label>Product Name:</label>
                    <input
                      type="text"
                      value={editForm.productName}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          productName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Size:</label>
                    <input
                      type="text"
                      value={editForm.selectedSize}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          selectedSize: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Color:</label>
                    <input
                      type="text"
                      value={editForm.selectedColor}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          selectedColor: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Quantity:</label>
                    <input
                      type="number"
                      value={editForm.quantity}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          quantity: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Total Price:</label>
                    <input
                      type="number"
                      value={editForm.totalPrice}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          totalPrice: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <h4>Delivery Details</h4>

                  <div className="form-group">
                    <label>Full Name:</label>
                    <input
                      type="text"
                      value={editForm.customerName}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          customerName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Street:</label>
                    <input
                      type="text"
                      value={editForm.street}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          street: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>House/Flat:</label>
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Pincode:</label>
                    <input
                      type="text"
                      value={editForm.pincode}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          pincode: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-actions">
                    <button onClick={() => handleSave(index)}>
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="order-details">
                  <h3>Product Details</h3>
                  <p>
                    <strong>Name:</strong> {item.name}
                  </p>
                  <p>
                    <strong>Size:</strong> {item.selectedSize}
                  </p>
                  <p>
                    <strong>Color:</strong> {item.selectedColor}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>Total Price:</strong> ₹{order.total}
                  </p>

                  <h3>Delivery Details</h3>
                  <p>
                    <strong>Full Name:</strong>{" "}
                    {order.customer?.name}
                  </p>
                  <p>
                    <strong>Street:</strong>{" "}
                    {order.address?.street}
                  </p>
                  <p>
                    <strong>House:</strong>{" "}
                    {order.address?.house}
                  </p>
                  <p>
                    <strong>Pincode:</strong>{" "}
                    {order.address?.pincode}
                  </p>

                  <div className="form-actions">
                    <button onClick={() => handleEdit(index)}>
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
