import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

// ==============================
// DATABASE CONNECTION
// ==============================
connectDB();

// ==============================
// MIDDLEWARES
// ==============================
app.use(express.json());

// CORS configuration for both local and deployed frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",            // local frontend
      process.env.FRONTEND_URL,           // deployed frontend
    ],
    credentials: true,
  })
);

// ==============================
// ROUTES
// ==============================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// ==============================
// TEST ROUTE
// ==============================
app.get("/", (req, res) => {
  res.send("API running...");
});

// ==============================
// GLOBAL ERROR HANDLER
// ==============================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

// ==============================
// START SERVER
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
