import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CategoryProductDetails.css";

export default function CategoryProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find((p) => String(p.id) === id);

  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.split(",")[0] || ""
  );
  const [currentImage, setCurrentImage] = useState(0);

  if (!product) {
    return <div className="product-details-box">Product not found</div>;
  }

  const addToCartOrBuy = (isBuyNow) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = existingCart.findIndex(
      (item) =>
        item.id === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push({
        ...product,
        price: Number(product.price),
        selectedSize,
        selectedColor,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));

    if (isBuyNow) {
      navigate("/checkout", { state: { cart: existingCart } });
    } else {
      alert("Added to cart");
    }
  };

  const images = product.images || [];

  return (
    <div className="product-details-box">
      <div className="image-slider">
        <button
          className="prev-btn"
          onClick={() =>
            setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
          }
        >
          ◀
        </button>

        <div className="image-track">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={product.name}
              style={{
                transform: `translateX(-${currentImage * 100}%)`,
                transition: "transform 0.5s ease-in-out",
              }}
            />
          ))}
        </div>

        <button
          className="next-btn"
          onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
        >
          ▶
        </button>
      </div>

      {images.length > 1 && (
        <div className="thumbnail-strip">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="thumb"
              className={`thumbnail ${currentImage === index ? "active" : ""}`}
              onClick={() => setCurrentImage(index)}
            />
          ))}
        </div>
      )}

      <div className="details">
        <h2>{product.name}</h2>
        <p className="price">₹{product.price}</p>
        <p className="description">{product.description}</p>

        {product.sizes?.length > 0 && (
          <div className="option-group">
            <p>Size:</p>
            {product.sizes.map((size) => (
              <button
                key={size}
                className={selectedSize === size ? "active" : ""}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {product.colors && (
          <div className="option-group">
            <p>Color:</p>
            {product.colors.split(",").map((color) => (
              <button
                key={color}
                className={selectedColor === color ? "active" : ""}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
        )}

        <div className="action-buttons">
          <button className="buy-btn" onClick={() => addToCartOrBuy(true)}>
            Buy Now
          </button>
          <button className="cart-btn" onClick={() => addToCartOrBuy(false)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
