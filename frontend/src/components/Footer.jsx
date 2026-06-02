import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-brand">Threadline</p>
          <p className="footer-tagline">Quality clothing for everyday life.</p>
        </div>
        <div className="footer-links">
          <Link to="/shop">Shop All</Link>
          <Link to="/shop?category=men">Men</Link>
          <Link to="/shop?category=women">Women</Link>
          <Link to="/shop?category=accessories">Accessories</Link>
        </div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} Threadline. All rights reserved.</p>
      </div>
    </footer>
  );
}
