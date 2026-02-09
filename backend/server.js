import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js"; // ✅ Orders (checkout)

dotenv.config();
connectDB();

const app = express();

// ==============================
// MIDDLEWARES
// ==============================
// Allow requests from frontend (adjust origin as needed)
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// ==============================
// ROUTES
// ==============================
app.use("/api/auth", authRoutes);        // Login / Signup
app.use("/api/products", productRoutes); // Products CRUD
app.use("/api/orders", orderRoutes);     // Orders / Checkout

// ==============================
// TEST ROUTE
// ==============================
app.get("/", (req, res) => {
  res.send("API running...");
});

// ==============================
// START SERVER
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
