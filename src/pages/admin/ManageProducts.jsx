import { useEffect, useState } from "react";
import "./ManageProducts.css";

const SIZE_OPTIONS = ["S", "M", "L", "XL"];

export default function ManageProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(stored);
  }, []);

  // Handle field change (local state only)
  const handleChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  // Toggle sizes (local state only)
  const toggleSize = (id, size) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;

        const sizes = p.sizes?.includes(size)
          ? p.sizes.filter((s) => s !== size)
          : [...(p.sizes || []), size];

        return { ...p, sizes };
      })
    );
  };

  // ✅ Update button
  const updateProduct = (id) => {
    localStorage.setItem("products", JSON.stringify(products));
    alert("Product updated successfully");
  };

  // ✅ Remove single product
  const removeProduct = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  return (
    <div className="manage-products">
      <h2>Manage Products</h2>

      {products.length === 0 ? (
        <p>No products added</p>
      ) : (
        <div className="admin-product-grid">
          {products.map((product) => (
            <div key={product.id} className="admin-product-card">
              <img src={product.images?.[0]} alt={product.name} />

              <h4>{product.name}</h4>
              <p className="price">₹{product.price}</p>
              <span className="category">{product.category}</span>

              {/* Quantity */}
              <div className="field">
                <label>Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={product.quantity ?? 0}
                  onChange={(e) =>
                    handleChange(product.id, "quantity", e.target.value)
                  }
                />
              </div>

              {/* Colors */}
              <div className="field">
                <label>Colors</label>
                <input
                  type="text"
                  value={product.colors || ""}
                  onChange={(e) =>
                    handleChange(product.id, "colors", e.target.value)
                  }
                />
              </div>

              {/* Sizes */}
              <div className="sizes">
                {SIZE_OPTIONS.map((size) => (
                  <label key={size}>
                    <input
                      type="checkbox"
                      checked={product.sizes?.includes(size) || false}
                      onChange={() => toggleSize(product.id, size)}
                    />
                    {size}
                  </label>
                ))}
              </div>

              {/* Buttons */}
              <div className="admin-actions">
                <button
                  className="update-btn"
                  onClick={() => updateProduct(product.id)}
                >
                  Update
                </button>

                <button
                  className="delete-btn"
                  onClick={() => removeProduct(product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
