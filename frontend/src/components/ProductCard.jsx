import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.featured && <span className="badge">Featured</span>}
      </Link>
      <div className="product-card-body">
        <p className="product-category">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <p className="product-price">${product.price.toFixed(2)}</p>
      </div>
    </article>
  );
}
