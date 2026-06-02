import { Router } from "express";
import { products, categories } from "../data/products.js";

const router = Router();

router.get("/categories", (_req, res) => {
  res.json(categories);
});

router.get("/", (req, res) => {
  const { category, featured, search } = req.query;
  let result = [...products];

  if (category) {
    result = result.filter((p) => p.category === category);
  }

  if (featured === "true") {
    result = result.filter((p) => p.featured);
  }

  if (search) {
    const query = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  res.json(result);
});

router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

export default router;
