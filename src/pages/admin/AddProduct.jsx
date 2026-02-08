// import { useState } from "react";
// import "./AddProduct.css";

// export default function AddProduct() {
//   const [product, setProduct] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "Womens",
//     image: "",
//     sizes: [],
//     colors: ""
//   });

//   const handleSizeChange = (size) => {
//     setProduct((prev) => ({
//       ...prev,
//       sizes: prev.sizes.includes(size)
//         ? prev.sizes.filter((s) => s !== size)
//         : [...prev.sizes, size]
//     }));
//   };

//   const handleAdd = () => {
//     const existing = JSON.parse(localStorage.getItem("products")) || [];
//     existing.push(product);
//     localStorage.setItem("products", JSON.stringify(existing));
//     alert("Product Added Successfully");
//   };

//   return (
//     <div className="admin-page">
//       <h2>Add Product</h2>

//       <input
//         placeholder="Product Name"
//         onChange={(e) => setProduct({ ...product, name: e.target.value })}
//       />

//       <input
//         placeholder="Image URL"
//         onChange={(e) => setProduct({ ...product, image: e.target.value })}
//       />

//       <textarea
//         placeholder="Description"
//         onChange={(e) => setProduct({ ...product, description: e.target.value })}
//       />

//       <input
//         type="number"
//         placeholder="Price"
//         onChange={(e) => setProduct({ ...product, price: e.target.value })}
//       />

//       <select
//         onChange={(e) => setProduct({ ...product, category: e.target.value })}
//       >
//         <option>Womens</option>
//         <option>Girls</option>
//         <option>Kids</option>
//         <option>Jewellery</option>
//         <option>Accessories</option>
//       </select>

//       {/* Sizes */}
//       <div className="size-box">
//         <p>Available Sizes</p>
//         {["S", "M", "L", "XL"].map((size) => (
//           <label key={size}>
//             <input
//               type="checkbox"
//               checked={product.sizes.includes(size)}
//               onChange={() => handleSizeChange(size)}
//             />
//             {size}
//           </label>
//         ))}
//       </div>

//       {/* Colors */}
//       <input
//         placeholder="Colors (comma separated e.g. Red, Blue, Black)"
//         onChange={(e) => setProduct({ ...product, colors: e.target.value })}
//       />

//       <button onClick={handleAdd}>Add Product</button>
//     </div>
//   );
// }

import { useState } from "react";
import "./AddProduct.css";

export default function AddProduct() {
  const [product, setProduct] = useState({
    id: Date.now(),
    name: "",
    description: "",
    price: "",
    category: "Womens",
    images: [],
    sizes: [],
    colors: "",
    quantity: 1
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const imageUrls = files.map(file =>
      URL.createObjectURL(file)
    );

    setProduct(prev => ({
      ...prev,
      images: imageUrls
    }));
  };

  const handleSizeChange = (size) => {
    setProduct(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleAddProduct = () => {
    if (!product.name || !product.price || product.images.length === 0) {
      alert("Please fill all required fields");
      return;
    }

    const existing =
      JSON.parse(localStorage.getItem("products")) || [];

    existing.push({ ...product, id: Date.now() });

    localStorage.setItem("products", JSON.stringify(existing));
    alert("Product added successfully");

    setProduct({
      id: Date.now(),
      name: "",
      description: "",
      price: "",
      category: "Womens",
      images: [],
      sizes: [],
      colors: "",
      quantity: 1
    });
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

      {/* MULTIPLE IMAGE INPUT */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />

      {/* IMAGE PREVIEW GRID */}
      {product.images.length > 0 && (
        <div className="image-preview-grid">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`preview-${index}`}
            />
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
        {["S", "M", "L", "XL"].map(size => (
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
