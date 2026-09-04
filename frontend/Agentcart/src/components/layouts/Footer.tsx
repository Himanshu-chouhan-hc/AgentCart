import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="site-footer">
    <div className="site-footer__brand"><span>AC</span> AgentCart <small>AI commerce, made simpler.</small></div>
    <nav className="site-footer__links" aria-label="Footer navigation">
      <Link to="/shop">Shop</Link>
      <Link to="/ai">AI Assistant</Link>
      <Link to="/orders">Orders</Link>
      <Link to="/profile">Account</Link>
    </nav>
    <small className="site-footer__copyright">© {new Date().getFullYear()} AgentCart</small>
  </footer>
);

export default Footer;
