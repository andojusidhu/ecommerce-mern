// import { useEffect, useState } from "react";
// import "./ProductList.css";

// export default function ProductList() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     setProducts(getProducts());
//   }, []);

//   const removeProduct = (id) => {
//     if (!window.confirm("Are you sure?")) return;

//     const updated = products.filter(p => p.id !== id);
//     setProducts(updated);
//     saveProducts(updated);
//   };

//   if (!products.length) {
//     return <h3 className="empty">No products available</h3>;
//   }

//   return (
//     <div className="admin-products">
//       <h2>All Products</h2>

//       <div className="product-grid">
//         {products.map(p => (
//           <div key={p.id} className="admin-card">
//             <img src={p.images?.[0]} alt={p.name} />
//             <h4>{p.name}</h4>
//             <p>₹{p.price}</p>
//             <p>Qty: {p.quantity}</p>

//             <button
//               className="delete-btn"
//               onClick={() => removeProduct(p.id)}
//             >
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React from 'react'

const ProductList = () => {
  return (
    <div>ProductList</div>
  )
}

export default ProductList