import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CategoryProductDetails.css";

export default function CategoryProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find((p) => String(p.id) === id);

  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.[0] || ""
  );
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.split(",")[0] || ""
  );
  const [currentImage, setCurrentImage] = useState(0);

  if (!product) {
    return <div className="product-details-box">Product not found</div>;
  }

  const handleBuyNow = () => {
    const orderData = {
      ...product,
      selectedSize,
      selectedColor,
      quantity: 1,
      totalPrice: Number(product.price)
    };
    navigate("/checkout", { state: { product: orderData } });
  };

  const handleAddToCart = () => {
    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = existingCart.findIndex(
      (item) =>
        item.id === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (existingIndex !== -1) {
      // Increase quantity if already exists
      existingCart[existingIndex].quantity += 1;
    } else {
      // Add new item
      existingCart.push({
        ...product,
        price: Number(product.price),
        selectedSize,
        selectedColor,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert("Added to cart");
  };

  const images = product.images || [];

  return (
    <div className="product-details-box">
      {/* Image Slider */}
      <div className="image-slider">
        <button
          className="prev-btn"
          onClick={() =>
            setCurrentImage(
              (prev) => (prev - 1 + images.length) % images.length
            )
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
                transition: "transform 0.5s ease-in-out"
              }}
            />
          ))}
        </div>

        <button
          className="next-btn"
          onClick={() =>
            setCurrentImage((prev) => (prev + 1) % images.length)
          }
        >
          ▶
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="thumbnail-strip">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="thumb"
              className={`thumbnail ${
                currentImage === index ? "active" : ""
              }`}
              onClick={() => setCurrentImage(index)}
            />
          ))}
        </div>
      )}

      {/* Product Details */}
      <div className="details">
        <h2>{product.name}</h2>
        <p className="price">₹{product.price}</p>
        <p className="description">{product.description}</p>

        {/* Size Selection */}
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

        {/* Color Selection */}
        {product.colors && (
          <div className="option-group">
            <p>Color:</p>
            {product.colors.split(",").map((color) => (
              <button
                key={color}
                className={
                  selectedColor === color ? "active" : ""
                }
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="buy-btn" onClick={handleBuyNow}>
            Buy Now
          </button>
          <button className="cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
