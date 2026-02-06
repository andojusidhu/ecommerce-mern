import { useParams } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find(p => p.id == id);

  if (!product) return <h2>Product Not Found</h2>;

  return (
    <div className="product-details">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <h3>₹{product.price}</h3>
      <p>Sizes: {product.sizes.join(", ")}</p>
      <p>Colors: {product.colors}</p>
    </div>
  );
}
