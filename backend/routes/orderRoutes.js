import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==============================
// CREATE ORDER (guest or logged-in)
// ==============================
router.post("/", async (req, res) => {
  try {
    const orderData = req.body;

    // If token exists, attach user
    if (req.headers.authorization) {
      try {
        const userMiddleware = authMiddleware;
        await new Promise((resolve, reject) =>
          userMiddleware(req, res, (err) => (err ? reject(err) : resolve()))
        );
        orderData.user = req.user._id;
      } catch {
        // token invalid/expired: still allow guest order
      }
    }

    const order = new Order(orderData);
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ==============================
// GET USER ORDERS (logged-in only)
// ==============================
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error("Fetch user orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ==============================
// UPDATE ORDER DELIVERY DETAILS
// ==============================
router.put("/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const updatedData = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Update delivery & items if provided
    if (updatedData.delivery) order.delivery = updatedData.delivery;
    if (updatedData.items) order.items = updatedData.items;
    if (updatedData.totalAmount !== undefined)
      order.totalAmount = updatedData.totalAmount;

    await order.save();
    res.json(order);
  } catch (err) {
    console.error("Update order error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
