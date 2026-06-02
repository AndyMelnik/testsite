import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5173;
const distPath = path.join(__dirname, "dist");

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "threadline-store" });
});

app.use(express.static(distPath, { index: false }));

app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Threadline store running on port ${PORT}`);
});
