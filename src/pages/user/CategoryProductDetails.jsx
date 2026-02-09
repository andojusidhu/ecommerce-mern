import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./CategoryProductDetails.css";

export default function CategoryProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🔹 FETCH PRODUCT FROM MONGODB
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products/${id}`
        );
        const data = await res.json();

        setProduct(data);
        setSelectedSize(data?.sizes?.[0] || "");
        setSelectedColor(data?.colors?.[0] || "");
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="product-details-box">Loading...</div>;
  }

  if (!product) {
    return <div className="product-details-box">Product not found</div>;
  }

  // 🔹 ADD TO CART / BUY NOW
  const addToCartOrBuy = (isBuyNow) => {
    const cartItem = {
      ...product,
      price: Number(product.price),
      selectedSize,
      selectedColor,
      quantity: 1,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = existingCart.findIndex(
      (item) =>
        item._id === product._id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (!isBuyNow) {
      // Add to cart logic
      if (existingIndex !== -1) {
        existingCart[existingIndex].quantity += 1;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(existingCart));
      alert("Added to cart");
    } else {
      // Buy now → send only this product
      navigate("/checkout", { state: { cart: [cartItem] } });
    }
  };

  const images = product.images || [];

  return (
    <div className="product-details-box">
      {/* IMAGE SLIDER */}
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
                transition: "transform 0.5s ease-in-out",
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

      {/* THUMBNAILS */}
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

      {/* PRODUCT DETAILS */}
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

        {product.colors?.length > 0 && (
          <div className="option-group">
            <p>Color:</p>
            {product.colors.map((color) => (
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
