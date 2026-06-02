import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function findFrontendDist() {
  const candidates = [
    path.join(__dirname, "../public"),
    path.join(__dirname, "../../frontend/dist"),
    path.join(process.cwd(), "public"),
    path.join(process.cwd(), "frontend/dist")
  ];

  return candidates.find((dir) => fs.existsSync(path.join(dir, "index.html")));
}

const frontendDist = findFrontendDist();

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
  res.json({
    status: "ok",
    service: "clothing-store-api",
    frontend: Boolean(frontendDist)
  });
});

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

if (frontendDist) {
  app.use(express.static(frontendDist));

  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  console.warn("Frontend build not found. Only /api routes are available.");

  app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
  });
}

app.listen(PORT, () => {
  console.log(`Clothing store running on port ${PORT}`);
  if (frontendDist) {
    console.log(`Serving frontend from ${frontendDist}`);
  }
});
