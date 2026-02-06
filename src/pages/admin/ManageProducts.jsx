import "./ManageProducts.css";

export default function ManageProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];

  return (
    <div className="manage-products">
      <h2>Manage Products</h2>

      {products.length === 0 ? (
        <p>No products added</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <div key={p.id} className="admin-product-card">
              <img src={p.image} alt={p.name} />
              <h4>{p.name}</h4>
              <p>₹{p.price}</p>
              <span>{p.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
