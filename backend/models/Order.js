import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Optional user reference for guest checkout
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // Delivery details
    delivery: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: "" },
      house: { type: String, required: true },
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },

    // Payment method
    payment: {
      type: String,
      enum: ["COD", "UPI", "Card"],
      default: "COD",
    },

    // Ordered items
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        image: { type: String, default: "" }, // Cloudinary image URL
        selectedSize: { type: String, default: "" },
        selectedColor: { type: String, default: "" },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],

    // Total order amount
    totalAmount: { type: Number, required: true },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.model("Order", orderSchema);
