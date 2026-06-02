import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/client";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ featured: "true" })
      .then(setFeatured)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <p className="eyebrow">New Season Collection</p>
          <h1>Clothing made for real life.</h1>
          <p className="hero-text">
            Discover thoughtfully designed pieces in premium fabrics — built to last and easy to wear.
          </p>
          <Link to="/shop" className="btn btn-primary">
            Shop the Collection
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/shop" className="text-link">
              View all
            </Link>
          </div>

          {loading ? (
            <p className="muted">Loading products...</p>
          ) : (
            <div className="product-grid">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section categories-section">
        <div className="container category-grid">
          <Link to="/shop?category=men" className="category-card">
            <span>Men</span>
          </Link>
          <Link to="/shop?category=women" className="category-card">
            <span>Women</span>
          </Link>
          <Link to="/shop?category=accessories" className="category-card">
            <span>Accessories</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
