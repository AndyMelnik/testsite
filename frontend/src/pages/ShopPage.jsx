import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCategories, getProducts } from "../api/client";
import ProductCard from "../components/ProductCard";

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const category = searchParams.get("category") || "";

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;

    getProducts(params)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [category, search]);

  function handleCategoryChange(nextCategory) {
    const params = new URLSearchParams(searchParams);
    if (nextCategory) {
      params.set("category", nextCategory);
    } else {
      params.delete("category");
    }
    setSearchParams(params);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  }

  return (
    <div className="section">
      <div className="container">
        <div className="page-header">
          <h1>Shop</h1>
          <p className="muted">Browse our full collection of clothing and accessories.</p>
        </div>

        <div className="shop-toolbar">
          <div className="filter-group">
            <button
              type="button"
              className={!category ? "filter-btn active" : "filter-btn"}
              onClick={() => handleCategoryChange("")}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={category === cat.id ? "filter-btn active" : "filter-btn"}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary">
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <p className="muted">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="muted">No products found.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
