import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css";

export default function Checkout({ setOrders }) {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    payment: "COD",
  });

  // ✅ Load cart + Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to place an order");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    const fromState = location.state?.cart;
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(Array.isArray(fromState) ? fromState : storedCart);
  }, [location.state, navigate]);

  const getItemPrice = (item) => {
    if (!item) return 0;
    if (item.price !== undefined) return Number(item.price) || 0;
    if (item.totalPrice && item.quantity)
      return Number(item.totalPrice) / Number(item.quantity);
    if (item.totalPrice) return Number(item.totalPrice) || 0;
    return 0;
  };

  const total = cartItems.reduce((sum, item) => {
    const price = getItemPrice(item);
    const qty = Number(item.quantity) || 1;
    return sum + price * qty;
  }, 0);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const placeOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    if (!formData.name || !formData.phone || !formData.house) {
      alert("Please fill required fields");
      return;
    }

    if (!cartItems.length) {
      alert("No products selected");
      return;
    }

    const orderPayload = {
      delivery: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        house: formData.house,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      payment: formData.payment,
      items: cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        image: item.images?.[0] || "",
        selectedSize: item.selectedSize || "",
        selectedColor: item.selectedColor || "",
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || getItemPrice(item),
      })),
      totalAmount: total,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order failed");

      if (typeof setOrders === "function") {
        setOrders((prev) => [...prev, data]);
      }

      localStorage.removeItem("cart");
      setCartItems([]);

      alert(`Thank you ${formData.name}! Your order has been placed successfully.`);
      navigate("/orders", { state: { justOrdered: true } });

    } catch (err) {
      console.error("Order error:", err);
      alert(err.message || "Failed to place order");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {/* Customer Details */}
      <section className="checkout-section">
        <h3>Customer Details</h3>
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      </section>

      {/* Delivery Address */}
      <section className="checkout-section">
        <h3>Delivery Address</h3>
        <input type="text" name="house" placeholder="House/Flat No." value={formData.house} onChange={handleChange} />
        <input type="text" name="street" placeholder="Street/Area" value={formData.street} onChange={handleChange} />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
        <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} />
      </section>

      {/* Payment Method */}
      <section className="checkout-section">
        <h3>Payment Method</h3>
        <select name="payment" value={formData.payment} onChange={handleChange}>
          <option value="COD">Cash on Delivery</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
        </select>
      </section>

      {/* Order Summary */}
      <section className="checkout-section">
        <h3>Order Summary</h3>
        {cartItems.length === 0 ? (
          <p>No products selected</p>
        ) : (
          cartItems.map((item, index) => {
            const price = getItemPrice(item);
            const qty = Number(item.quantity) || 1;

            return (
              <div key={index} className="summary-item">
                <div className="summary-left">
                  <img
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.name}
                    className="summary-img"
                  />
                  <div className="summary-meta">
                    <div className="summary-name">{item.name}</div>
                    <div className="summary-opts">
                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                    </div>
                  </div>
                </div>
                <div className="summary-right">
                  <span>{qty} × ₹{price}</span>
                </div>
              </div>
            );
          })
        )}
        <h4>Total: ₹{total}</h4>
      </section>

      <button className="place-order-btn" onClick={placeOrder}>
        Place Order
      </button>
    </div>
  );
}
