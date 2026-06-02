import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          Threadline
        </Link>

        <nav className="nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/shop?category=men">Men</NavLink>
          <NavLink to="/shop?category=women">Women</NavLink>
          <NavLink to="/shop?category=accessories">Accessories</NavLink>
        </nav>

        <Link to="/cart" className="cart-link">
          Cart
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </Link>
      </div>
    </header>
  );
}
