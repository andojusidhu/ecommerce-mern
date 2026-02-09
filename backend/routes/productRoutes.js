import express from "express";
import Product from "../models/Product.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ==============================
// ADD PRODUCT (ADMIN)
// ==============================
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    console.log("REQ BODY 👉", req.body);
    console.log("REQ FILES 👉", req.files);

    const {
      name,
      description,
      price,
      category,
      sizes,
      colors,
      quantity,
    } = req.body;

    // Validation
    if (!name || !price || !category) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: "Please upload at least one image" });
    }

    const imageUrls = req.files.map((file) => file.path);

    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      sizes: sizes ? JSON.parse(sizes) : [],
      colors: colors ? colors.split(",").map((c) => c.trim()) : [],
      quantity: Number(quantity) || 0,
      images: imageUrls,
    });

    await product.save();

    console.log("✅ PRODUCT SAVED TO MONGODB");
    res.status(201).json(product);

  } catch (err) {
    console.error("❌ ADD PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// GET ALL PRODUCTS
// ==============================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// 🔥 GET SINGLE PRODUCT BY ID (IMPORTANT)
// ==============================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// UPDATE PRODUCT
// ==============================
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// DELETE PRODUCT
// ==============================
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
