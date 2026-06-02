import express from "express";
import cors from "cors";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
];

app.use(
  cors({
    origin: allowedOrigins
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "clothing-store-api" });
});

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Clothing store API running at http://localhost:${PORT}`);
});
