import { useEffect, useState } from "react";
import { Heart, ShoppingBag, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getWishlist,
  removeFromWishlist,
  type WishlistItem,
} from "../services/wishlistApi";

const Wishlist = () => {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("agentcart_token");

    if (!token) {
      navigate("/login");
      return;
    }

    const loadWishlist = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getWishlist();
        if (isMounted) setWishlist(data);
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load wishlist."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadWishlist();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleRemove = async (productId: string) => {
    const previousWishlist = wishlist;
    setRemovingId(productId);
    setError("");

    // Optimistically update UI
    setWishlist((prev) =>
      prev.filter(
        (item) => item.productId !== productId && item.product?.id !== productId
      )
    );

    try {
      await removeFromWishlist(productId);
    } catch (err) {
      // Rollback on failure
      setWishlist(previousWishlist);
      setError(
        err instanceof Error
          ? err.message
          : "Could not remove item."
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 w-48 rounded bg-gray-200" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl bg-white"
                >
                  <div className="h-64 bg-gray-200" />
                  <div className="p-5">
                    <div className="h-5 w-3/4 rounded bg-gray-200" />
                    <div className="mt-3 h-5 w-1/3 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-5 flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black"
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <Heart size={25} fill="currentColor" />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  My Wishlist
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  {wishlist.length}{" "}
                  {wishlist.length === 1 ? "item" : "items"} saved for later
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {wishlist.length === 0 && !error ? (
          <div className="mt-12 rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-400">
              <Heart size={38} fill="currentColor" />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Save products you love and come back to them whenever you're ready.
            </p>

            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#F4D000] px-6 py-3.5 text-sm font-bold text-[#111] transition hover:bg-[#e6c700]"
            >
              <ShoppingBag size={18} />
              Explore Shop
            </button>
          </div>
        ) : (
          /* PRODUCTS */
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((item) => {
              const product = item.product;
              const isRemoving = removingId === product.id;

              return (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* IMAGE */}
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <ShoppingBag size={50} />
                      </div>
                    )}

                    {/* REMOVE */}
                    <button
                      type="button"
                      onClick={() => void handleRemove(product.id)}
                      disabled={isRemoving}
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-red-500 shadow-sm transition hover:bg-red-50 disabled:opacity-50"
                      aria-label="Remove from wishlist"
                    >
                      {isRemoving ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>

                  {/* DETAILS */}
                  <div className="p-5">
                    {product.brand && (
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        {product.brand}
                      </p>
                    )}

                    <h2 className="mt-2 line-clamp-2 text-lg font-bold">
                      {product.name}
                    </h2>

                    {/* RATING */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded-lg bg-yellow-100 px-2.5 py-1 text-xs font-bold text-gray-800">
                        ★ {Number(product.rating || 0).toFixed(1)}
                      </span>

                      <span className="text-xs text-gray-500">
                        {product.reviewCount || 0} reviews
                      </span>
                    </div>

                    {/* PRICE */}
                    <div className="mt-4">
                      <span className="text-2xl font-bold">
                        ₹
                        {Number(product.price).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* STOCK */}
                    <p
                      className={`mt-2 text-xs font-semibold ${
                        product.stock > 0
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} available`
                        : "Out of stock"}
                    </p>

                    {/* BUTTON */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/products/${product.id}`)
                      }
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#111] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800"
                    >
                      <ShoppingBag size={17} />
                      View Product
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default Wishlist;