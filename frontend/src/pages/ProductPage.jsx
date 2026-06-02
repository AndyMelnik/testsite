import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../api/client";
import { useCart } from "../context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    getProduct(id)
      .then((data) => {
        setProduct(data);
        setSize(data.sizes[0]);
        setColor(data.colors[0]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
      color,
      quantity
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <p className="muted">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="section">
        <div className="container">
          <p className="error">{error || "Product not found."}</p>
          <Link to="/shop" className="text-link">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container product-detail">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-detail-info">
          <p className="product-category">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="product-price large">${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>

          <div className="option-group">
            <label htmlFor="size">Size</label>
            <select id="size" value={size} onChange={(e) => setSize(e.target.value)}>
              {product.sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="option-group">
            <label htmlFor="color">Color</label>
            <select id="color" value={color} onChange={(e) => setColor(e.target.value)}>
              {product.colors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="option-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <button type="button" className="btn btn-primary" onClick={handleAddToCart}>
            Add to Cart
          </button>

          {added && <p className="success">Added to cart!</p>}
        </div>
      </div>
    </div>
  );
}
