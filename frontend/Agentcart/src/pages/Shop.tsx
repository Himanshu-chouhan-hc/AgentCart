import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Search,
  ShoppingBag,
  Star,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import {
  getProducts,
  type Product,
} from "../services/productApi";

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
  }, []);

  const categories = useMemo(() => {
    const categoryNames = products
      .map((product) => product.category?.name)
      .filter(Boolean) as string[];

    return ["All", ...new Set(categoryNames)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const searchQuery = query.toLowerCase().trim();

    return products.filter((product) => {
      const matchesQuery =
        product.name.toLowerCase().includes(searchQuery) ||
        product.description
          ?.toLowerCase()
          .includes(searchQuery);

      const matchesCategory =
        category === "All" ||
        product.category?.name === category;

      return Boolean(matchesQuery && matchesCategory);
    });
  }, [products, query, category]);

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
              onChange={(event) =>
                setQuery(event.target.value)
              }
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