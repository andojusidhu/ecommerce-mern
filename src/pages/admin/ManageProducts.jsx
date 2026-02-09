import { useEffect, useState } from "react";
import "./ManageProducts.css";

const SIZE_OPTIONS = ["S", "M", "L", "XL"];

export default function ManageProducts() {
  const [products, setProducts] = useState([]);

  // fetch products from backend
  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // handle field change (local state only)
  const handleChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, [field]: value } : p
      )
    );
  };

  // toggle sizes
  const toggleSize = (id, size) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p._id !== id) return p;

        const sizes = p.sizes?.includes(size)
          ? p.sizes.filter((s) => s !== size)
          : [...(p.sizes || []), size];

        return { ...p, sizes };
      })
    );
  };

  // update product
  const updateProduct = async (id) => {
    const product = products.find((p) => p._id === id);

    const res = await fetch(
      `http://localhost:5000/api/products/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      }
    );

    if (res.ok) {
      alert("Product updated successfully");
      fetchProducts();
    } else {
      alert("Update failed");
    }
  };

  // delete product
  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    const res = await fetch(
      `http://localhost:5000/api/products/${id}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      alert("Product deleted");
      fetchProducts();
    } else {
      alert("Delete failed");
    }
  };

  return (
    <div className="manage-products">
      <h2>Manage Products</h2>

      {products.length === 0 ? (
        <p>No products added</p>
      ) : (
        <div className="admin-product-grid">
          {products.map((product) => (
            <div key={product._id} className="admin-product-card">
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
                    handleChange(product._id, "quantity", e.target.value)
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
                    handleChange(product._id, "colors", e.target.value)
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
                      onChange={() => toggleSize(product._id, size)}
                    />
                    {size}
                  </label>
                ))}
              </div>

              {/* Buttons */}
              <div className="admin-actions">
                <button
                  className="update-btn"
                  onClick={() => updateProduct(product._id)}
                >
                  Update
                </button>

                <button
                  className="delete-btn"
                  onClick={() => removeProduct(product._id)}
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
