import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "frontend/dist");
const target = path.join(root, "backend/public");

if (!fs.existsSync(path.join(source, "index.html"))) {
  console.error("frontend/dist/index.html not found. Run: npm run build --prefix frontend");
  process.exit(1);
}

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });
console.log("Copied frontend/dist to backend/public");
