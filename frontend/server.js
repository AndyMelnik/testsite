import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5173;
const distPath = path.join(__dirname, "dist");
const indexPath = path.join(distPath, "index.html");

if (!fs.existsSync(indexPath)) {
  console.error("Build output missing. Run: npm run build");
  process.exit(1);
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "threadline-store" });
});

app.use(express.static(distPath));

app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Threadline store running on port ${PORT}`);
});
