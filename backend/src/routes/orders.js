import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { products } from "../data/products.js";

const router = Router();
const orders = [];

router.post("/", (req, res) => {
  const { items, customer } = req.body;

  if (!items?.length) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  if (!customer?.email || !customer?.name || !customer?.address) {
    return res.status(400).json({ error: "Customer name, email, and address are required" });
  }

  const orderItems = [];
  let total = 0;

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);

    if (!product) {
      return res.status(400).json({ error: `Product not found: ${item.productId}` });
    }

    if (!product.sizes.includes(item.size)) {
      return res.status(400).json({ error: `Invalid size for ${product.name}` });
    }

    const quantity = Math.max(1, Number(item.quantity) || 1);
    const lineTotal = product.price * quantity;
    total += lineTotal;

    orderItems.push({
      productId: product.id,
      name: product.name,
      size: item.size,
      color: item.color || product.colors[0],
      quantity,
      unitPrice: product.price,
      lineTotal
    });
  }

  const order = {
    id: uuidv4(),
    items: orderItems,
    customer,
    total: Math.round(total * 100) / 100,
    status: "confirmed",
    createdAt: new Date().toISOString()
  };

  orders.push(order);

  res.status(201).json(order);
});

router.get("/:id", (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json(order);
});

export default router;
