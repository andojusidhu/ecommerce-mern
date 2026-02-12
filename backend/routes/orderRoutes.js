import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================================
   CREATE ORDER (Login Required)
===================================================== */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const orderData = req.body;

    if (
      !orderData.delivery?.name ||
      !orderData.delivery?.phone ||
      !orderData.delivery?.house ||
      !orderData.items?.length
    ) {
      return res.status(400).json({
        message: "Missing required order fields",
      });
    }

    const formattedItems = orderData.items.map((item) => ({
      productId: item.productId,
      name: item.name || "Unknown Product",
      image: item.image || item.images?.[0] || "",
      selectedSize: item.selectedSize || "",
      selectedColor: item.selectedColor || "",
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0,
    }));

    const newOrder = new Order({
      user: req.user._id,
      delivery: orderData.delivery,
      payment: orderData.payment || "COD",
      items: formattedItems,
      totalAmount: Number(orderData.totalAmount),
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

/* =====================================================
   GET USER ORDERS ONLY
===================================================== */
// GET USER ORDERS ONLY
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized: Missing user" });
    }

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Return empty array if no orders
    return res.status(200).json(orders || []);
  } catch (err) {
    console.error("Fetch orders error:", err); // Detailed log for server
    // Send error message to frontend safely
    return res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
});


/* =====================================================
   GET SINGLE ORDER (Owner Only)
===================================================== */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    res.status(200).json(order);
  } catch (err) {
    console.error("Fetch single order error:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

/* =====================================================
   UPDATE ORDER (Owner Only)
===================================================== */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    if (req.body.delivery) order.delivery = { ...order.delivery, ...req.body.delivery };
    if (req.body.items) {
      order.items = req.body.items.map((item) => ({
        productId: item.productId,
        name: item.name || "Unknown Product",
        image: item.image || item.images?.[0] || "",
        selectedSize: item.selectedSize || "",
        selectedColor: item.selectedColor || "",
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
      }));
    }
    if (req.body.totalAmount !== undefined) order.totalAmount = Number(req.body.totalAmount);
    if (req.body.payment) order.payment = req.body.payment;

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Update order error:", err);
    res.status(500).json({ message: "Failed to update order" });
  }
});

/* =====================================================
   DELETE ORDER (Owner Only)
===================================================== */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await order.deleteOne();
    res.status(200).json({ message: "Order removed successfully" });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({ message: "Failed to delete order" });
  }
});

export default router;
