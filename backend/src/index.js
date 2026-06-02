import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.join(__dirname, "../../frontend/dist");
const hasFrontend = fs.existsSync(path.join(frontendDist, "index.html"));

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
];

app.use(
  cors({
    origin: allowedOrigins.length > 1 || process.env.FRONTEND_URL ? allowedOrigins : true
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "clothing-store-api" });
});

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

if (hasFrontend) {
  app.use(express.static(frontendDist));

  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
  });
}

app.listen(PORT, () => {
  console.log(`Clothing store API running on port ${PORT}`);
  if (hasFrontend) {
    console.log("Serving frontend from frontend/dist");
  }
});
