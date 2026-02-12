import { useEffect, useState } from "react";
import "./Orders.css";

export default function Orders({ orders: parentOrders }) {
  const [orders, setOrders] = useState([]);

  // Load orders from backend when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`);
        if (!res.ok) {
          console.error("Fetch failed:", res.status);
          setOrders([]);
          return;
        }

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (err) {
        console.error("Fetch orders error:", err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  // Update orders if Checkout passes new orders via state
  useEffect(() => {
    if (parentOrders && parentOrders.length) {
      setOrders(parentOrders);
    }
  }, [parentOrders]);

  // Cloudinary helper
  const getCloudinaryImage = (url) => {
    if (!url) return "/placeholder.png";
    return url.includes("/upload/")
      ? url.replace("/upload/", "/upload/w_220,h_220,c_fill/")
      : url;
  };

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order, index) => {
        const item = order.items?.[0] || {};
        const imageUrl = getCloudinaryImage(item.image || item.product?.images?.[0]);

        return (
          <div className="order-card" key={order._id || index}>
            <div className="order-header">
              <img
                src={imageUrl}
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
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
