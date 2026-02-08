import "./Categories.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Categories() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Load products from localStorage
  useEffect(() => {
    const storedProducts =
      JSON.parse(localStorage.getItem("products")) || [];
    setProducts(storedProducts);
  }, []);

  // Default rating
  const defaultRating = 4.5;

  // Render products category-wise
  const renderCategory = (title, categoryKey) => {
    const categoryProducts = products.filter(
      (product) => product.category === categoryKey
    );

    if (categoryProducts.length === 0) return null;

    return (
      <section id={categoryKey.toLowerCase()} className="category-block">
        <div className="category-header">
          <h2>{title}</h2>
        </div>

        <div className="category-products">
          {categoryProducts.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="category-product-card"
              onClick={() =>
                navigate(`/category-product/${item.id}`)
              }
            >
              <img
                src={item.images?.[0]}
                alt={item.name}
              />

              <div className="product-info">
                <h4>{item.name}</h4>

                {/* Default Rating */}
                <div className="rating">
                  <span className="stars">
                    ★★★★☆
                  </span>
                  <span className="rating-number">
                    {defaultRating}
                  </span>
                </div>

                <div className="price">₹{item.price}</div>
              </div>
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
