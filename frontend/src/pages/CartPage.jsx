import { useState } from "react";
import { Link } from "react-router-dom";
import { createOrder } from "../api/client";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, subtotal, itemCount, removeItem, updateQuantity, clearCart } = useCart();
  const [customer, setCustomer] = useState({ name: "", email: "", address: "" });
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  async function handleCheckout(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const result = await createOrder({
        customer,
        items: items.map(({ productId, size, color, quantity }) => ({
          productId,
          size,
          color,
          quantity
        }))
      });
      setOrder(result);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (order) {
    return (
      <div className="section">
        <div className="container checkout-success">
          <h1>Order Confirmed</h1>
          <p>Thank you, {order.customer.name}! Your order has been placed.</p>
          <p className="muted">Order ID: {order.id}</p>
          <p className="product-price">Total: ${order.total.toFixed(2)}</p>
          <Link to="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="section">
        <div className="container empty-state">
          <h1>Your Cart</h1>
          <p className="muted">Your cart is empty.</p>
          <Link to="/shop" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container cart-layout">
        <div>
          <h1>Your Cart</h1>
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.key} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="muted">
                    {item.size} · {item.color}
                  </p>
                  <p className="product-price">${item.price.toFixed(2)}</p>
                </div>
                <div className="cart-item-actions">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.key, Number(e.target.value))}
                  />
                  <button type="button" className="text-link" onClick={() => removeItem(item.key)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="checkout-panel">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal ({itemCount} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <form className="checkout-form" onSubmit={handleCheckout}>
            <h3>Shipping Details</h3>
            <label>
              Full Name
              <input
                required
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              />
            </label>
            <label>
              Email
              <input
                required
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              />
            </label>
            <label>
              Address
              <textarea
                required
                rows="3"
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
              />
            </label>

            {error && <p className="error">{error}</p>}

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
