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

  // Load cart from navigation state (buy now) or from localStorage
  useEffect(() => {
    const fromState = location.state?.cart;
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

    const resolvedCart = Array.isArray(fromState) ? fromState : storedCart;
    setCartItems(resolvedCart);
  }, [location.state]);

  // Helper: extract item price safely as Number
  const getItemPrice = (item) => {
    if (item == null) return 0;
    if (item.price !== undefined && item.price !== null) return Number(item.price) || 0;
    if (item.totalPrice && item.quantity) return Number(item.totalPrice) / Number(item.quantity);
    if (item.totalPrice) return Number(item.totalPrice) || 0;
    return 0;
  };

  // Total calculation
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

  const placeOrder = () => {
    // Basic validation
    if (!formData.name || !formData.phone || !formData.house) {
      alert("Please fill all required fields (Name, Phone, House/Flat).");
      return;
    }

    if (!cartItems.length) {
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
      items: cartItems.map((it) => ({
        // ensure item snapshot contains important fields
        id: it.id,
        name: it.name,
        image: it.image || (it.images && it.images[0]) || "",
        selectedSize: it.selectedSize || "",
        selectedColor: it.selectedColor || "",
        quantity: Number(it.quantity) || 1,
        price: Number(it.price) || getItemPrice(it),
      })),
      total: total,
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const updatedOrders = [...existingOrders, newOrder];

    // persist orders
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // update parent state if provided
    if (typeof setOrders === "function") {
      setOrders(updatedOrders);
    }

    // clear cart
    localStorage.removeItem("cart");
    setCartItems([]);

    // friendly greeting
    alert(`Thank you ${formData.name}! Your order has been placed successfully.`);

    // navigate to orders page and indicate justOrdered (for greeting there)
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
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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
          value={formData.house}
          onChange={handleChange}
        />
        <input
          type="text"
          name="street"
          placeholder="Street/Area"
          value={formData.street}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
        />
      </section>

      {/* Payment */}
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
                    src={item.image || (item.images && item.images[0]) || "/placeholder.png"}
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
                  <span>
                    {qty} × ₹{price}
                  </span>
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
