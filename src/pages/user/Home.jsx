import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedProducts =
      JSON.parse(localStorage.getItem("products")) || [];
    const storedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setProducts(storedProducts);
    setCart(storedCart);
  }, []);

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const updateCartStorage = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const addToCart = (product) => {
    let updatedCart = [...cart];

    const existing = updatedCart.find(
      (item) => item.id === product.id
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    updateCartStorage(updatedCart);
  };

  const increaseQty = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    updateCartStorage(updatedCart);
  };

  const decreaseQty = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCartStorage(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    updateCartStorage(updatedCart);
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderSection = (title, items) => (
    <div className="section">
      <h2>{title}</h2>
      <div className="product-grid">
        {items.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img
                src={product.image || product.images?.[0]}
                alt={product.name}
              />
            </div>
            <div className="product-info">
              <h4>{product.name}</h4>
              <p className="price">₹{product.price}</p>
              <button onClick={() => addToCart(product)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const newlyArrived = filteredProducts.slice(0, 4);
  const trending = filteredProducts.slice(4, 8);

  // ✅ UPDATED BUY NOW HANDLER
  const handleBuyNow = () => {
    if (!cart.length) return;

    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/checkout", { state: { cart } });
  };

  return (
    <div className="home-container">
      {/* Top bar */}
      <div className="top-bar">
        <h1 className="logo">Iconic Era</h1>

        <div className="cart-icon" onClick={toggleCart}>
          🛒
          {cart.length > 0 && (
            <span className="cart-count">{cart.length}</span>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Festival boxes */}
      <div className="festival-section">
        <div className="festival-box">🎉 Festival Offer</div>
        <div className="festival-box">💖 Special Deal</div>
        <div className="festival-box">🔥 Limited Time</div>
      </div>

      {renderSection("Newly Arrived", newlyArrived)}
      {renderSection("Trending Items", trending)}

      {/* CART PANEL */}
      <div className={`cart-panel ${cartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button
            className="close-cart"
            onClick={() => setCartOpen(false)}
          >
            ← Back
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="empty-cart">No items in cart</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image || item.images?.[0]}
                    alt={item.name}
                  />

                  <div className="cart-info">
                    <h4>{item.name}</h4>
                    <p>₹{item.price}</p>

                    <div className="qty-controls">
                      <button
                        onClick={() => decreaseQty(item.id)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQty(item.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <h4>Total: ₹{totalPrice}</h4>
              <button
                className="checkout-btn"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
