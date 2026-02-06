import "./Categories.css";
import { useNavigate } from "react-router-dom";

export default function Categories() {
  const navigate = useNavigate();

  // Get products added by admin (frontend only)
  const products = JSON.parse(localStorage.getItem("products")) || [];

  const renderCategory = (title, categoryKey) => {
    const categoryProducts = products.filter(p => p.category === categoryKey);
    const showProducts = categoryProducts.slice(0, 4); // show only 4

    if (categoryProducts.length === 0) return null;

    return (
      <section id={categoryKey.toLowerCase()} className="category-block">
        <div className="category-header">
          <h2>{title}</h2>
          {categoryProducts.length > 4 && (
            <span
              className="see-more"
              onClick={() => navigate(`/categories/${categoryKey.toLowerCase()}`)}
            >
              See More
            </span>
          )}
        </div>

        <div className="category-products">
          {showProducts.map(item => (
            <div
              key={item.id}
              className="category-product-card"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <img src={item.image} alt={item.name} />
              <h4>{item.name}</h4>
              <div className="price">₹{item.price}</div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="categories-page">
      <h1 className="page-title">Shop by Category</h1>

      {/* Category Navigation */}
      <div className="category-selector">
        <a href="#womens">Womens</a>
        <a href="#girls">Girls</a>
        <a href="#kids">Kids</a>
        <a href="#jewellery">Jewellery</a>
        <a href="#accessories">Accessories</a>
      </div>

      {renderCategory("Womens", "Womens")}
      {renderCategory("Girls", "Girls")}
      {renderCategory("Kids", "Kids")}
      {renderCategory("Jewellery", "Jewellery")}
      {renderCategory("Accessories", "Accessories")}
    </div>
  );
}
