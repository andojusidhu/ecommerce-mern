import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products", err));

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateCartStorage = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const addToCart = (product) => {
    let updatedCart = [...cart];
    const existing = updatedCart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    updateCartStorage(updatedCart);
  };

  const increaseQty = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCartStorage(updatedCart);
  };

  const decreaseQty = (id) => {
    const updatedCart = cart
      .map((item) =>
        item._id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    updateCartStorage(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    updateCartStorage(updatedCart);
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const newlyArrived = filteredProducts.slice(0, 4);
  const trending = filteredProducts.slice(4, 8);

  const renderSection = (title, items) => (
    <div className="category-block">
      <div className="category-header">
        <h2>{title}</h2>
      </div>
      <div className="category-products">
        {items.map((product) => (
          <div
            key={product._id}
            className="category-product-card"
            onClick={() =>
              navigate(`/categoryproductdetails/${product._id}`, {
                state: { product },
              })
            }
          >
            <img
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.name}
            />
            <h4>{product.name}</h4>
            {product.rating && (
              <div className="rating">
                <span className="stars">★ {product.rating}</span>
                <span className="rating-number">({product.reviews || 0})</span>
              </div>
            )}
            <p className="price">₹{product.price}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const handleBuyNow = () => {
    if (!cart.length) return;
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/checkout", { state: { cart } });
  };

  return (
    <div className="home-container">
      {/* Top Bar */}
      <div className="top-bar">
        <h1 className="logo">Iconic Era</h1>
        <div className="right-top">
          <a
            href="https://wa.me/919704733035"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-icon"
          >
            <img
              src="https://png.pngtree.com/png-clipart/20190516/original/pngtree-whatsapp-icon-png-image_3584844.jpg"
              alt="WhatsApp"
            />
          </a>
          <div
            className="cart-icon"
            onClick={() => cart.length && setCartOpen(!cartOpen)}
          >
            🛒
            {totalCartItems > 0 && (
              <span className="cart-count">{totalCartItems}</span>
            )}
          </div>
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

      {/* Festival Section */}
      <div className="festival-section">
        <div className="festival-box">🎉 Festival Offer</div>
        <div className="festival-box">💖 Special Deal</div>
        <div className="festival-box">🔥 Limited Time</div>
      </div>

      {/* Product Sections */}
      {renderSection("Newly Arrived", newlyArrived)}
      {renderSection("Trending Items", trending)}

      {/* Cart Panel */}
      {cartOpen && (
        <div className="cart-panel">
          <div className="cart-header">
            <h3>Your Cart</h3>
            <button className="close-cart" onClick={() => setCartOpen(false)}>
              ← Back
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="empty-cart">No items in cart</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item._id} className="cart-item">
                    <img src={item.images?.[0] || item.image} alt={item.name} />
                    <div className="cart-info">
                      <h4>{item.name}</h4>
                      <p>₹{item.price}</p>
                      <div className="qty-controls">
                        <button onClick={() => decreaseQty(item._id)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQty(item._id)}>+</button>
                      </div>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item._id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-footer">
                <h4>Total: ₹{totalPrice}</h4>
                <button className="checkout-btn" onClick={handleBuyNow}>
                  Buy Now
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
