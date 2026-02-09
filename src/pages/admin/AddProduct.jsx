import { useState } from "react";
import "./AddProduct.css";

export default function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Womens",
    images: [],
    sizes: [],
    colors: "",
    quantity: 1,
  });

  const [previewImages, setPreviewImages] = useState([]);

  // handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // store actual files
    setProduct((prev) => ({
      ...prev,
      images: files,
    }));

    // preview
    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewImages(previews);
  };

  const handleSizeChange = (size) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  // send to backend
  const handleAddProduct = async () => {
    if (!product.name || !product.price || product.images.length === 0) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("category", product.category);
      formData.append("sizes", JSON.stringify(product.sizes));
      formData.append("colors", product.colors);
      formData.append("quantity", product.quantity);

      product.images.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to add product");
        return;
      }

      alert("Product added successfully");

      // reset form
      setProduct({
        name: "",
        description: "",
        price: "",
        category: "Womens",
        images: [],
        sizes: [],
        colors: "",
        quantity: 1,
      });
      setPreviewImages([]);
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  return (
    <div className="admin-page">
      <h2>Add Product</h2>

      <input
        placeholder="Product Name"
        value={product.name}
        onChange={(e) =>
          setProduct({ ...product, name: e.target.value })
        }
      />

      {/* IMAGE INPUT */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />

      {/* IMAGE PREVIEW */}
      {previewImages.length > 0 && (
        <div className="image-preview-grid">
          {previewImages.map((img, index) => (
            <img key={index} src={img} alt={`preview-${index}`} />
          ))}
        </div>
      )}

      <textarea
        placeholder="Description"
        value={product.description}
        onChange={(e) =>
          setProduct({ ...product, description: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Price"
        value={product.price}
        onChange={(e) =>
          setProduct({ ...product, price: e.target.value })
        }
      />

      <select
        value={product.category}
        onChange={(e) =>
          setProduct({ ...product, category: e.target.value })
        }
      >
        <option>Womens</option>
        <option>Girls</option>
        <option>Kids</option>
        <option>Jewellery</option>
        <option>Accessories</option>
      </select>

      <div className="size-box">
        <p>Available Sizes</p>
        {["S", "M", "L", "XL"].map((size) => (
          <label key={size}>
            <input
              type="checkbox"
              checked={product.sizes.includes(size)}
              onChange={() => handleSizeChange(size)}
            />
            {size}
          </label>
        ))}
      </div>

      <input
        placeholder="Colors (comma separated)"
        value={product.colors}
        onChange={(e) =>
          setProduct({ ...product, colors: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Quantity"
        value={product.quantity}
        onChange={(e) =>
          setProduct({ ...product, quantity: e.target.value })
        }
      />

      <button onClick={handleAddProduct}>Add Product</button>
    </div>
  );
}
