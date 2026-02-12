import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

/* =====================================================
   CREATE ORDER (Guest Checkout - No Login Required)
===================================================== */
router.post("/", async (req, res) => {
  try {
    const orderData = req.body;

    // Basic validation
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

    // Format items properly
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
      user: orderData.user || null, // optional
      delivery: orderData.delivery,
      payment: orderData.payment || "COD",
      items: formattedItems,
      totalAmount: Number(orderData.totalAmount),
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Create order error:", err.message);
    res.status(500).json({ message: "Failed to create order" });
  }
});

/* =====================================================
   GET ALL ORDERS (For Orders Page)
===================================================== */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err.message);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/* =====================================================
   GET SINGLE ORDER BY ID
===================================================== */
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("Fetch single order error:", err.message);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

/* =====================================================
   UPDATE ORDER (Guest Can Update by ID)
===================================================== */
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.body.delivery) {
      order.delivery = { ...order.delivery, ...req.body.delivery };
    }

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

    if (req.body.totalAmount !== undefined) {
      order.totalAmount = Number(req.body.totalAmount);
    }

    if (req.body.payment) {
      order.payment = req.body.payment;
    }

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Update order error:", err.message);
    res.status(500).json({ message: "Failed to update order" });
  }
});

export default router;
