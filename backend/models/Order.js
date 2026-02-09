import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // optional for guest checkout
    },
    delivery: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      house: { type: String, required: true },
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    payment: {
      type: String,
      enum: ["COD", "UPI", "Card"],
      default: "COD",
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        image: { type: String }, // Cloudinary image URL
        selectedSize: { type: String },
        selectedColor: { type: String },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
