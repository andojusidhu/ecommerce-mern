import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    sizes: [String],
    colors: [String],
    quantity: { type: Number, default: 1 },
    images: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
