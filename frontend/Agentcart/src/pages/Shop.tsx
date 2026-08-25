import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search, ShoppingBag, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts, type Product } from "../services/productApi";
import { addToCart } from "../services/cartApi";
import "../styles/shop.css";

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getProducts().then(setProducts).catch(() => setNotice("Could not load products right now.")).finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(products.map((product) => product.category?.name).filter(Boolean) as string[])];
  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) || product.description?.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || product.category?.name === category;
    return matchesQuery && matchesCategory;
  }), [products, query, category]);

  const handleAdd = async (productId: string) => {
    if (!localStorage.getItem("agentcart_token")) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(productId);
      setNotice("Added to your cart.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not add this product.");
    }
  };

  return (
    <main className="shop-page">
      <section className="shop-hero"><div><p className="shop-eyebrow">THE AGENTCART EDIT</p><h1>Find something <em>worth keeping.</em></h1><p>Browse thoughtful picks, compare what matters, and let your shopping agent do the sorting.</p></div></section>
      <section className="shop-content">
        <div className="shop-toolbar"><div className="shop-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." aria-label="Search products" /></div><div className="shop-categories">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
        {notice && <p className="shop-notice" role="status">{notice}</p>}
        {loading ? <div className="shop-empty">Loading your curated collection...</div> : filteredProducts.length === 0 ? <div className="shop-empty"><ShoppingBag size={30} /><h2>No products found</h2><p>Try a different search or category.</p></div> : <div className="shop-grid">{filteredProducts.map((product) => <article className="shop-product" key={product.id}><div className="shop-product-image">{product.image ? <img src={product.image} alt={product.name} /> : <ShoppingBag size={34} />}</div><div className="shop-product-info"><p>{product.category?.name || "Curated pick"}</p><h2>{product.name}</h2><div className="shop-rating"><Star size={14} fill="currentColor" /> {product.rating.toFixed(1)} <span>({product.reviewCount})</span></div><div className="shop-product-bottom"><strong>₹{Number(product.price).toLocaleString("en-IN")}</strong><button onClick={() => void handleAdd(product.id)} aria-label={`Add ${product.name} to cart`}><ShoppingBag size={15} /> Add</button></div></div></article>)}</div>}
      </section>
      <section className="shop-cta"><div><p>SHOP WITH INTENT</p><h2>Your next great find is closer than you think.</h2></div><Link to="/" className="shop-cta-link">Meet your agent <ArrowRight size={17} /></Link></section>
    </main>
  );
};

export default Shop;
