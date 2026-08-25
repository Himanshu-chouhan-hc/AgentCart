import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Menu,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";

const AgentCartLogo = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Yellow stroke */}
      <path
        d="M8 29.5L17.5 7.5C18.2 5.9 20.5 5.7 21.5 7.1L25 12.2"
        stroke="#F4D000"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Black A */}
      <path
        d="M12 32L20.2 10.2L29.5 32"
        stroke="#111111"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* A cross */}
      <path
        d="M16.5 23.5H26"
        stroke="#111111"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Yellow accent */}
      <path
        d="M25 12.2L29.5 18"
        stroke="#F4D000"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const navigate = useNavigate();

  // Load user from localStorage on mount and when it changes
  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("agentcart_user");
      if (!savedUser) {
        setUser(null);
        return;
      }

      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("agentcart_user");
        setUser(null);
      }
    };

    // Load user on mount
    loadUser();

    // Listen for storage changes (logout in same or other tabs)
    window.addEventListener("storage", loadUser);
    
    // Listen for custom logout event
    window.addEventListener("logout", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("logout", loadUser);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar__inner">

        {/* ================= LOGO ================= */}
        <a
          href="/"
          aria-label="AgentCart home"
          className="navbar__brand"
        >
          <span className="navbar__brand-mark">
            <AgentCartLogo />
          </span>

          <span className="navbar__brand-name">
            Agent<span>Cart</span>
          </span>
        </a>

        {/* ================= NAV LINKS ================= */}
        <div className="navbar__desktop-links">
          <a
            href="/"
            className="navbar__link navbar__link--active"
          >
            Home
          </a>

          <Link
            to="/shop"
            className="navbar__link"
          >
            Shop
          </Link>
        </div>

        {/* ================= SEARCH ================= */}
        <div className="navbar__search">
          <Search size={18} />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products or ask AI..."
              aria-label="Search products"
              className=""
            />

            <kbd>
              Ctrl K
            </kbd>
        </div>

        {/* ================= RIGHT ACTIONS ================= */}
        <div className="navbar__actions">

          

          {/* Cart */}
          <button
            type="button"
            aria-label="Open shopping cart"
            className="navbar__icon-button navbar__cart"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart size={20} />

            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-yellow-400 px-1 text-[10px] font-bold text-black">
              0
            </span>
          </button>

          {/* Profile */}
          <Link
  to="/profile"
  aria-label="Go to profile"
  className="navbar__profile"
>
  <span className="navbar__avatar">
    {user?.name?.charAt(0).toUpperCase() || "G"}
  </span>

  <span className="navbar__profile-name">
    Hi, {user?.name || "Guest"}
  </span>
</Link>
          {/* Mobile Menu */}
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            onClick={() => setMenuOpen(!menuOpen)}
            className="navbar__menu-button"
          >
            {menuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="navbar__mobile-menu">

          <div className="navbar__search">
            <Search size={18} />

            <input
              type="search"
              placeholder="Search products or ask AI..."
              className=""
            />
          </div>

          <div>

            <a
              href="#"
              onClick={() => setMenuOpen(false)}
              className="navbar__mobile-link navbar__link--active"
            >
              Home
            </a>

            <a
              href="#shop"
              onClick={() => setMenuOpen(false)}
              className="navbar__mobile-link"
            >
              Shop
            </a>

            <a
              href="#orders"
              onClick={() => setMenuOpen(false)}
              className="navbar__mobile-link"
            >
              Orders
            </a>

            <button
              type="button"
              className="navbar__mobile-link navbar__mobile-link--button"
            >
              Profile
            </button>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;