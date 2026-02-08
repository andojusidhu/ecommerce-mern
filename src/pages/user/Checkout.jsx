import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

export default function Checkout({ setOrders }) {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

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

  // Load cart from localStorage
  useEffect(() => {
    const storedCart =
      JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  // Safe price extraction
  const getItemPrice = (item) => {
    if (item.price) return Number(item.price);
    if (item.totalPrice && item.quantity)
      return Number(item.totalPrice) / item.quantity;
    if (item.totalPrice) return Number(item.totalPrice);
    return 0;
  };

  // Total calculation
  const total = cartItems.reduce((sum, item) => {
    const price = getItemPrice(item);
    const qty = item.quantity || 1;
    return sum + price * qty;
  }, 0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = () => {
    if (!formData.name || !formData.phone || !formData.house) {
      alert("Please fill all required fields");
      return;
    }

    if (cartItems.length === 0) {
      alert("No products selected");
      return;
    }

    const newOrder = {
      id: "ORD" + Date.now(),
      date: new Date().toLocaleString(),
      status: "Placed",
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
      },
      address: {
        house: formData.house,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      payment: formData.payment,
      items: cartItems,
      total,
    };

    const existingOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    const updatedOrders = [...existingOrders, newOrder];

    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    if (setOrders) {
      setOrders(updatedOrders);
    }

    // Clear cart after order
    localStorage.removeItem("cart");
    setCartItems([]);

    // Greeting message
    alert(`Thank you ${formData.name}! Your order has been placed successfully.`);

    // Navigate to orders page
    navigate("/orders", { state: { justOrdered: true } });

  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {/* Customer Details */}
      <section className="checkout-section">
        <h3>Customer Details</h3>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
      </section>

      {/* Address */}
      <section className="checkout-section">
        <h3>Delivery Address</h3>
        <input
          type="text"
          name="house"
          placeholder="House/Flat No."
          onChange={handleChange}
        />
        <input
          type="text"
          name="street"
          placeholder="Street/Area"
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={handleChange}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          onChange={handleChange}
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          onChange={handleChange}
        />
      </section>

      {/* Payment */}
      <section className="checkout-section">
        <h3>Payment Method</h3>
        <select name="payment" onChange={handleChange}>
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
            const qty = item.quantity || 1;

            return (
              <div key={index} className="summary-item">
                <span>{item.name}</span>
                <span>
                  {qty} × ₹{price}
                </span>
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
