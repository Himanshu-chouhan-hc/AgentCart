import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";

/* ================= BRAND LOGO ================= */
const AgentCartLogo = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
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
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load user from localStorage on mount and when changed
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

    loadUser();

    window.addEventListener("storage", loadUser);
    window.addEventListener("logout", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("logout", loadUser);
    };
  }, []);

  // Global Keyboard Shortcut: Ctrl + K or Cmd + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [menuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
      setMenuOpen(false);
    }
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
      isActive
        ? "text-[#111111] border-b-2 border-[#F4D000]"
        : "text-gray-600 hover:text-[#111111]"
    }`;

  const initial = user?.name?.charAt(0)?.toUpperCase() || "G";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          
          {/* ================= BRAND LOGO ================= */}
          <Link
            to="/"
            aria-label="AgentCart Home"
            className="flex items-center gap-2.5 transition-transform hover:opacity-95 active:scale-95"
          >
            <AgentCartLogo />
            <span className="text-xl font-black tracking-tight text-[#111111]">
              Agent<span className="text-[#b39a00]">Cart</span>
            </span>
          </Link>

          {/* ================= DESKTOP NAV LINKS ================= */}
          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" end className={navLinkStyle}>
              Home
            </NavLink>
            <NavLink to="/shop" className={navLinkStyle}>
              Shop
            </NavLink>
          </nav>

          {/* ================= SEARCH BAR (DESKTOP) ================= */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden flex-1 max-w-md md:block"
          >
            <div className="relative flex items-center">
              <Search
                size={18}
                className="absolute left-3 text-gray-400 pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products or ask AI..."
                aria-label="Search products"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-16 text-sm text-[#111111] transition-all placeholder:text-gray-400 focus:border-[#F4D000] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F4D000]/30"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={15} />
                </button>
              ) : (
                <kbd className="absolute right-2.5 hidden select-none items-center gap-1 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400 sm:inline-flex">
                  ⌘K
                </kbd>
              )}
            </div>
          </form>

          {/* ================= RIGHT ACTIONS ================= */}
          <div className="flex items-center gap-1 sm:gap-2">

            {/* Shopping Cart */}
            <button
              type="button"
              aria-label="Open shopping cart"
              onClick={() => navigate("/cart")}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100 active:scale-95"
            >
              <ShoppingCart size={20} />
              <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#F4D000] px-1 text-[10px] font-bold text-[#111111] shadow-sm">
                0
              </span>
            </button>

            {/* Profile Link (Desktop) */}
            <Link
              to="/profile"
              aria-label="Go to profile"
              className="hidden items-center gap-2.5 rounded-xl border border-gray-200 p-1.5 pr-3 transition hover:border-gray-300 hover:bg-gray-50 sm:flex"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F4D000] text-xs font-bold text-[#111111]">
                {initial}
              </span>
              <span className="max-w-[100px] truncate text-xs font-bold text-[#111111]">
                {user?.name ? user.name.split(" ")[0] : "Guest"}
              </span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 active:scale-95 md:hidden"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU DRAWER ================= */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMenuOpen(false)}
          />

          {/* Sliding Menu Panel */}
          <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-white p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="text-lg font-bold">Menu</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Input (Mobile) */}
            <form onSubmit={handleSearchSubmit} className="mt-4">
              <div className="relative flex items-center">
                <Search size={17} className="absolute left-3 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm focus:border-[#F4D000] focus:bg-white focus:outline-none"
                />
              </div>
            </form>

            {/* User Profile Summary */}
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="mt-5 flex items-center gap-3 rounded-xl bg-gray-50 p-3 hover:bg-gray-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4D000] font-bold text-[#111111]">
                {initial}
              </div>
              <div className="flex flex-col truncate">
                <span className="truncate text-sm font-bold">
                  {user?.name || "Guest Account"}
                </span>
                <span className="truncate text-xs text-gray-500">
                  {user?.email || "Click to sign in"}
                </span>
              </div>
            </Link>

            {/* Links */}
            <div className="mt-6 flex flex-col gap-1 space-y-1 border-t border-gray-100 pt-4">
              <NavLink
                to="/"
                end
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-yellow-50 text-[#111111]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/shop"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-yellow-50 text-[#111111]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                Shop
              </NavLink>

              <NavLink
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-yellow-50 text-[#111111]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                Orders
              </NavLink>

              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-yellow-50 text-[#111111]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <span className="flex items-center gap-3">
                  <User size={17} />
                  Profile Settings
                </span>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;