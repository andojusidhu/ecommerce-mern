import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">

      {/* Top Bar */}
      <div className="home-top">
        <h1 className="brand-name">Iconic Era</h1>

        <div className="cart-icon">
          🛒
          <span className="cart-count">0</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search products..."
          className="search-input"
        />
        <button className="search-btn">🔍</button>
      </div>

      {/* Festival Offers */}
      <section className="section">
        <h2 className="section-title">🎉 Festival Offers</h2>
        <div className="center-row">
          <div className="offer-card">Up to 50% OFF</div>
          <div className="offer-card">Buy 1 Get 1</div>
          <div className="offer-card">Festive Specials</div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section">
        <h2 className="section-title">✨ New Arrivals</h2>
        <div className="center-row">
          <div className="product-card">Trendy Wear</div>
          <div className="product-card">Smart Gadgets</div>
          <div className="product-card">Footwear</div>
        </div>
      </section>

      {/* Top Brands */}
      <section className="section">
        <h2 className="section-title">🔥 Top Brands</h2>
        <div className="center-row">
          <div className="brand-card">Nike</div>
          <div className="brand-card">Adidas</div>
          <div className="brand-card">Puma</div>
        </div>
      </section>

    </div>
  );
}
