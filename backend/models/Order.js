import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // 🔐 User reference (Login Required)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Now login is mandatory
    },

    // 🚚 Delivery details
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

    // 💳 Payment method
    payment: {
      type: String,
      enum: ["COD", "UPI", "Card"],
      default: "COD",
    },

    // 🛒 Ordered items
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String, default: "" }, // Cloudinary image URL
        selectedSize: { type: String, default: "" },
        selectedColor: { type: String, default: "" },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],

    // 💰 Total order amount
    totalAmount: {
      type: Number,
      required: true,
    },

    // 📦 Order status (Future upgrade)
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.model("Order", orderSchema);
