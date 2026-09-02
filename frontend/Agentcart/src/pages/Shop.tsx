import { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import {
  getProducts,
  type Product,
} from "../services/productApi";

import { addToCart } from "../services/cartApi";
import type { AIRecommendation } from "../services/aiApi";

import "../styles/shop.css";

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [aiSearchActive, setAiSearchActive] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [aiMessage, setAiMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const aiState = location.state as
      | { aiQuery?: string; aiProducts?: Product[]; aiRecommendations?: AIRecommendation[]; aiMessage?: string }
      | undefined;

    if (aiState?.aiProducts || aiState?.aiRecommendations || aiState?.aiMessage) {
      setProducts(aiState.aiProducts || []);
      setAiRecommendations(aiState.aiRecommendations || []);
      setAiMessage(aiState.aiMessage || "");
      setQuery(aiState.aiQuery || "");
      setCategory("All");
      setAiSearchActive(true);
      setNotice("AI-picked products for your search.");
      setLoading(false);
      return;
    }

    setAiSearchActive(false);
    setAiRecommendations([]);
    setAiMessage("");

    const loadProducts = async () => {
      try {
        setLoading(true);

        const data = await getProducts();

        setProducts(data);
      } catch (error) {
        setNotice(
          error instanceof Error
            ? error.message
            : "Could not load products right now."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, [location.state]);

  const categories = useMemo(() => {
    const categoryNames = products
      .map((product) => product.category?.name)
      .filter(Boolean) as string[];

    return ["All", ...new Set(categoryNames)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const searchQuery = query.toLowerCase().trim();

    return products.filter((product) => {
      const matchesCategory =
        category === "All" ||
        product.category?.name === category;

      if (aiSearchActive) {
        return matchesCategory;
      }

      const matchesQuery =
        product.name.toLowerCase().includes(searchQuery) ||
        product.description?.toLowerCase().includes(searchQuery) ||
        product.category?.name.toLowerCase().includes(searchQuery);

      return Boolean(matchesQuery && matchesCategory);
    });
  }, [products, query, category, aiSearchActive]);

  const handleAdd = async (
    event: React.MouseEvent<HTMLButtonElement>,
    productId: string
  ) => {
    event.stopPropagation();

    const token = localStorage.getItem("agentcart_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await addToCart(productId);

      setNotice("Added to your cart.");

      setTimeout(() => {
        setNotice("");
      }, 2500);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not add this product."
      );
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <main className="shop-page">

      {/* HERO */}
      <section className="shop-hero">
        <div>
          <p className="shop-eyebrow">
            THE AGENTCART EDIT
          </p>

          <h1>
            Find something{" "}
            <em>worth keeping.</em>
          </h1>

          <p>
            Browse thoughtful picks, compare what matters,
            and let your shopping agent do the sorting.
          </p>
        </div>
      </section>

      {/* SHOP CONTENT */}
      <section className="shop-content">

        {/* TOOLBAR */}
        <div className="shop-toolbar">

          {/* SEARCH */}
          <div className="shop-search">
            <Search size={18} />

            <input
              value={query}
              onChange={(event) => {
                const nextQuery = event.target.value;
                setQuery(nextQuery);
                setSearchParams((currentParams) => {
                  if (nextQuery.trim()) {
                    currentParams.set("search", nextQuery);
                  } else {
                    currentParams.delete("search");
                  }
                  return currentParams;
                }, { replace: true });
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  setSearchParams((currentParams) => {
                    if (query.trim()) {
                      currentParams.set("search", query);
                    } else {
                      currentParams.delete("search");
                    }
                    return currentParams;
                  }, { replace: true });
                }
              }}
              placeholder="Search products..."
              aria-label="Search products"
            />
          </div>

          {/* CATEGORIES */}
          <div className="shop-categories">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  category === item ? "active" : ""
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* NOTICE */}
        {notice && (
          <p
            className="shop-notice"
            role="status"
          >
            {notice}
          </p>
        )}

        {aiSearchActive && (
          <section className="ai-recommendations" aria-labelledby="ai-recommendations-title">
            <div className="ai-recommendations-heading">
              <div>
                <p className="shop-eyebrow"><Sparkles size={14} /> AI RECOMMENDATIONS</p>
                <h2 id="ai-recommendations-title">Based on your requirements</h2>
                <p>“{query}”</p>
              </div>
            </div>

            {aiRecommendations.length === 0 ? (
              <div className="ai-recommendations-empty">
                <p>{aiMessage || "I couldn't find products that closely match your requirements."}</p>
                <span>Try changing your budget or requirements.</span>
              </div>
            ) : (
              <div className="ai-recommendation-grid">
                {aiRecommendations.map((recommendation, index) => (
                  <article className={`ai-recommendation ${index === 0 ? "best-match" : ""}`} key={recommendation.product.id}>
                    {index === 0 && <span className="best-match-label"><Sparkles size={13} /> Best Match</span>}
                    <button type="button" className="ai-recommendation-image" onClick={() => handleProductClick(recommendation.product.id)}>
                      {recommendation.product.image ? <img src={recommendation.product.image} alt={recommendation.product.name} /> : <ShoppingBag size={30} />}
                    </button>
                    <div className="ai-recommendation-body">
                      <span className="ai-rank">{index === 0 ? "1st" : index === 1 ? "2nd" : "3rd"} recommendation</span>
                      <h3>{recommendation.product.name}</h3>
                      <div className="ai-price-score">
                        <strong>₹{Number(recommendation.product.price).toLocaleString("en-IN")}</strong>
                        <span>AI Match: {recommendation.score}%</span>
                      </div>
                      <p className="ai-reason"><strong>Why this matches:</strong> {recommendation.reason}</p>
                      <ul>{recommendation.pros.map((pro) => <li key={pro}>✓ {pro}</li>)}</ul>
                      <button type="button" className="ai-view-product" onClick={() => handleProductClick(recommendation.product.id)}>View Product <ArrowRight size={14} /></button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* LOADING */}
        {loading && (
          <div className="shop-empty">
            Loading your curated collection...
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          filteredProducts.length === 0 && (
            <div className="shop-empty">
              <ShoppingBag size={30} />

              <h2>
                No products found
              </h2>

              <p>
                Try a different search or category.
              </p>
            </div>
          )}

        {/* PRODUCTS */}
        {!loading &&
          filteredProducts.length > 0 && (
            <div className="shop-grid">

              {filteredProducts.map((product) => (
                <article
                  className="shop-product"
                  key={product.id}
                  onClick={() =>
                    handleProductClick(product.id)
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      handleProductClick(product.id);
                    }
                  }}
                >

                  {/* IMAGE */}
                  <div className="shop-product-image">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                      />
                    ) : (
                      <ShoppingBag size={34} />
                    )}
                  </div>

                  {/* INFO */}
                  <div className="shop-product-info">

                    <p>
                      {product.category?.name ||
                        "Curated pick"}
                    </p>

                    <h2>
                      {product.name}
                    </h2>

                    {/* RATING */}
                    <div className="shop-rating">
                      <Star
                        size={14}
                        fill="currentColor"
                      />

                      {product.rating.toFixed(1)}

                      <span>
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* PRICE + CART */}
                    <div className="shop-product-bottom">

                      <strong>
                        ₹
                        {Number(
                          product.price
                        ).toLocaleString("en-IN")}
                      </strong>

                      <button
                        type="button"
                        onClick={(event) =>
                          void handleAdd(
                            event,
                            product.id
                          )
                        }
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingBag size={15} />

                        Add
                      </button>

                    </div>
                  </div>
                </article>
              ))}

            </div>
          )}
      </section>

      {/* CTA */}
      <section className="shop-cta">

        <div>
          <p>
            SHOP WITH INTENT
          </p>

          <h2>
            Your next great find is closer
            than you think.
          </h2>
        </div>

        <Link
          to="/"
          className="shop-cta-link"
        >
          Meet your agent

          <ArrowRight size={17} />
        </Link>

      </section>

    </main>
  );
};

export default Shop;