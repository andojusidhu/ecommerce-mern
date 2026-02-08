import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./UserProductDetails.css";

export default function UserProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const products =
      JSON.parse(localStorage.getItem("products")) || [];

    const found = products.find(
      (p) => String(p.id) === String(id)
    );

    setProduct(found);
  }, [id]);

  if (!product) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const addToCart = () => {
    const cart =
      JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ ...product, qty: 1, selectedSize });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  return (
    <div className="user-product-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Categories
      </button>

      <div className="user-product-container">
        <div className="image-section">
          <img
            src={product.images[0]}
            alt={product.name}
            className="main-img"
          />
        </div>

        <div className="details-section">
          <h1>{product.name}</h1>
          <p className="price">₹{product.price}</p>
          <p className="desc">{product.description}</p>

          {product.sizes?.length > 0 && (
            <div className="sizes">
              <p>Select Size</p>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={
                    selectedSize === size ? "active" : ""
                  }
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          <p>
            <strong>Colors:</strong> {product.colors}
          </p>

          <div className="actions">
            <button className="cart-btn" onClick={addToCart}>
              Add to Cart
            </button>
            <button className="buy-btn">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
