import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./CheckoutCart.css";

export default function CheckoutCart() {
  const location = useLocation();
  const navigate = useNavigate();

  // load cart from state or localStorage
  const [cartItems, setCartItems] = useState(
    location.state?.cart ||
      JSON.parse(localStorage.getItem("cart")) ||
      []
  );

  const [form, setForm] = useState({
    name: "",
    street: "",
    address: "",
    pincode: "",
    phone: "",
    email: "",
    paymentType: "Cash on Delivery"
  });

  // update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // total price calculation
  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity || 1),
    0
  );

  // remove item
  const removeItem = (id) => {
    const updatedCart = cartItems.filter(
      (item) => item.id !== id
    );
    setCartItems(updatedCart);
  };

  // quantity change
  const updateQuantity = (id, qty) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, qty || 1) }
        : item
    );
    setCartItems(updatedCart);
  };

  if (!cartItems.length) {
    return (
      <div className="checkout-container">
        <h2>No items in cart</h2>
      </div>
    );
  }

  const handleOrder = () => {
    const existingOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    const newOrder = {
      id: Date.now(),
      items: cartItems,
      totalPrice,
      ...form,
      orderDate: new Date().toLocaleString(),
      status: "Confirmed"
    };

    localStorage.setItem(
      "orders",
      JSON.stringify([...existingOrders, newOrder])
    );

    localStorage.removeItem("cart");
    navigate("/orders");
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {/* Product Details */}
      <div className="checkout-section">
        <h3>Product Details</h3>

        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img
              src={item.image || item.images?.[0]}
              alt={item.name}
              className="checkout-img"
            />

            <div className="cart-info">
              <h4>{item.name}</h4>
              <p>₹{item.price}</p>

              <div className="cart-controls">
                <input
                  type="number"
                  min="1"
                  value={item.quantity || 1}
                  onChange={(e) =>
                    updateQuantity(
                      item.id,
                      parseInt(e.target.value)
                    )
                  }
                />
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="item-total">
              ₹{item.price * (item.quantity || 1)}
            </div>
          </div>
        ))}

        <div className="cart-summary">
          <h3>Total Price: ₹{totalPrice}</h3>
        </div>
      </div>

      {/* Delivery Details */}
      <div className="checkout-section">
        <h3>Delivery Details</h3>

        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
        <input
          placeholder="Street"
          value={form.street}
          onChange={(e) =>
            setForm({ ...form, street: e.target.value })
          }
        />
        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />
        <input
          placeholder="Pincode"
          value={form.pincode}
          onChange={(e) =>
            setForm({ ...form, pincode: e.target.value })
          }
        />
        <input
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <select
          value={form.paymentType}
          onChange={(e) =>
            setForm({
              ...form,
              paymentType: e.target.value
            })
          }
        >
          <option value="Cash on Delivery">
            Cash on Delivery
          </option>
          <option value="UPI">UPI</option>
          <option value="Credit/Debit Card">
            Credit/Debit Card
          </option>
        </select>

        <button
          className="place-order-btn"
          onClick={handleOrder}
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}
