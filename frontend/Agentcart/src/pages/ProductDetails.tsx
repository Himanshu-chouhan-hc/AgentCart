import { useEffect, useState } from "react";
import { useNavigate, useParams } from  "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Star,
  Heart,
  Sparkles,
  Check,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

import {
  checkWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistApi";

import {
  getProductById,
  type Product,
} from "../services/productApi";

import { addToCart } from "../services/cartApi";

import {
  getProductReviews,
  createReview,
  type Review,
} from "../services/reviewApi";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [wishlist, setWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [notice, setNotice] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [adding, setAdding] = useState(false);

  const [selectedRating, setSelectedRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Helper for status notices
  const showNotice = (text: string, type: "success" | "error" = "success") => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 4000);
  };

  // Load product
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        showNotice(
          error instanceof Error ? error.message : "Failed to load product",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
  }, [id]);

  // Load wishlist status
  useEffect(() => {
    const loadWishlistStatus = async () => {
      if (!id) return;

      const token = localStorage.getItem("agentcart_token");
      if (!token) return;

      try {
        const isWishlisted = await checkWishlist(id);
        setWishlist(isWishlisted);
      } catch (error) {
        console.error("Failed to check wishlist:", error);
      }
    };

    void loadWishlistStatus();
  }, [id]);

  // Load reviews
  useEffect(() => {
    const loadReviews = async () => {
      if (!id) return;

      try {
        setReviewsLoading(true);
        const data = await getProductReviews(id);
        setReviews(data);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    void loadReviews();
  }, [id]);

  // Add to cart
  const handleAddToCart = async () => {
    if (!product) return;

    const token = localStorage.getItem("agentcart_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setAdding(true);
      await addToCart(product.id);
      showNotice("Added to your cart.", "success");
    } catch (error) {
      showNotice(
        error instanceof Error ? error.message : "Could not add product to cart.",
        "error"
      );
    } finally {
      setAdding(false);
    }
  };

  // Wishlist toggle
  const handleWishlistToggle = async () => {
    if (!id) return;

    const token = localStorage.getItem("agentcart_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setWishlistLoading(true);
      if (wishlist) {
        await removeFromWishlist(id);
        setWishlist(false);
        showNotice("Removed from wishlist.", "success");
      } else {
        await addToWishlist(id);
        setWishlist(true);
        showNotice("Added to wishlist.", "success");
      }
    } catch (error) {
      showNotice(
        error instanceof Error ? error.message : "Could not update wishlist.",
        "error"
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  // Submit review
  const handleSubmitReview = async () => {
    if (!id) return;

    const token = localStorage.getItem("agentcart_token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (comment.trim().length < 3) {
      showNotice("Review must be at least 3 characters.", "error");
      return;
    }

    try {
      setSubmittingReview(true);
      const newReview = await createReview(id, selectedRating, comment.trim());

      setReviews((prev) => [newReview, ...prev]);

      const ratingUsed = selectedRating;
      setComment("");
      setSelectedRating(5);

      setProduct((prev) => {
        if (!prev) return prev;
        const oldCount = prev.reviewCount || 0;
        const newCount = oldCount + 1;
        const newRating =
          ((Number(prev.rating) || 0) * oldCount + ratingUsed) / newCount;

        return {
          ...prev,
          rating: newRating,
          reviewCount: newCount,
        };
      });

      showNotice("Review submitted successfully.", "success");
    } catch (error) {
      showNotice(
        error instanceof Error ? error.message : "Could not submit review.",
        "error"
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // Loading skeleton state
  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="h-10 w-36 rounded-xl bg-gray-200" />
            <div className="mt-8 grid gap-12 lg:grid-cols-2">
              <div className="h-[480px] rounded-3xl bg-gray-200" />
              <div className="space-y-4">
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-10 w-3/4 rounded-xl bg-gray-200" />
                <div className="h-6 w-32 rounded-lg bg-gray-200" />
                <div className="h-8 w-28 rounded-lg bg-gray-200" />
                <div className="h-28 rounded-2xl bg-gray-200" />
                <div className="h-14 rounded-xl bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Product not found state
  if (!product) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-5 py-20">
        <div className="mx-auto max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <ShoppingBag size={32} />
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Product not found
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            The item you are looking for does not exist or has been removed.
          </p>
          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="mt-6 w-full rounded-xl bg-[#111] py-3 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            Back to Shop
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* TOP NAV BAR */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 active:scale-95"
          >
            <ArrowLeft size={16} />
            Back to Shop
          </button>
        </div>

        {/* FLOATING NOTICE BANNER */}
        {notice && (
          <div
            className={`mt-4 flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-medium shadow-sm animate-in fade-in slide-in-from-top-2 duration-200 ${
              notice.type === "error"
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            {notice.type === "error" ? (
              <AlertCircle size={18} className="shrink-0 text-red-600" />
            ) : (
              <Check size={18} className="shrink-0 text-emerald-600" />
            )}
            <span>{notice.text}</span>
          </div>
        )}

        {/* PRODUCT GRID */}
        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-12">
          {/* IMAGE CONTAINER */}
          <div className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-gray-200/70 bg-white p-6 shadow-sm">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-300">
                <ShoppingBag size={64} strokeWidth={1.5} />
                <span className="mt-2 text-xs font-medium text-gray-400">
                  No preview available
                </span>
              </div>
            )}
          </div>

          {/* PRODUCT INFORMATION */}
          <div className="flex flex-col justify-center">
            {/* CATEGORY & BRAND */}
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-600">
                {product.category?.name || "Curated Product"}
              </span>
              {product.brand && (
                <span className="text-xs font-medium text-gray-400">
                  by <strong className="text-gray-700">{product.brand}</strong>
                </span>
              )}
            </div>

            {/* TITLE */}
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>

            {/* RATING BADGE & REVIEWS COUNT */}
            <div className="mt-4 flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-sm font-bold text-amber-900 ring-1 ring-inset ring-amber-500/20">
                <Star size={15} className="fill-amber-400 text-amber-400" />
                {Number(product.rating || 0).toFixed(1)}
              </div>
              <span className="text-sm font-medium text-gray-500">
                ({product.reviewCount || 0}{" "}
                {product.reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>

            {/* PRICE */}
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-900 sm:text-4xl">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">
              {product.description ||
                "A carefully selected product from the AgentCart collection."}
            </p>

            {/* STOCK STATUS */}
            <div className="mt-5 flex items-center gap-2">
              {product.stock > 0 ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  In Stock ({product.stock} available)
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Out of Stock
                </div>
              )}
            </div>

            {/* AI SUGGESTION CARD */}
            <div className="mt-6 rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/80 to-yellow-50/30 p-4.5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                <Sparkles size={15} className="text-amber-500" />
                <span>AI Shopping Assistant</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-amber-950/80 sm:text-sm">
                This product holds a{" "}
                <strong>{Number(product.rating || 0).toFixed(1)}/5</strong> rating and ranks high in{" "}
                <strong>{product.category?.name || "its category"}</strong>. Recommended based on customer satisfaction, build standard, and overall value.
              </p>
            </div>

            {/* CTA BUTTONS (ADD TO CART + WISHLIST) */}
            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                disabled={adding || product.stock <= 0}
                onClick={() => void handleAddToCart()}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#F4D000] py-4 text-sm font-bold text-gray-950 shadow-sm transition hover:bg-[#e2bf00] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag size={18} />
                {adding ? "Adding to Cart..." : "Add to Cart"}
              </button>

              <button
                type="button"
                disabled={wishlistLoading}
                onClick={() => void handleWishlistToggle()}
                className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition active:scale-95 ${
                  wishlist
                    ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100/70"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } disabled:cursor-not-allowed disabled:opacity-50`}
                aria-label={
                  wishlist ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Heart
                  size={20}
                  className={wishlist ? "fill-current text-red-500" : ""}
                />
              </button>
            </div>

            {/* ASSURANCE BADGES */}
            <div className="mt-6 flex items-center justify-around rounded-xl border border-gray-100 bg-white p-3 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-gray-400" />
                <span>Verified Quality</span>
              </div>
              <div className="h-3 w-px bg-gray-200" />
              <div>Fast Dispatch</div>
              <div className="h-3 w-px bg-gray-200" />
              <div>Secure Checkout</div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <section className="mt-16 border-t border-gray-200/80 pt-12">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            {/* WRITE REVIEW */}
            <div className="h-fit rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Customer Feedback
              </p>
              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                Write a review
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Share your experience to help other buyers.
              </p>

              {/* STAR SELECTOR */}
              <div className="mt-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Select Rating
                </p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeRating = hoverRating ?? selectedRating;
                    const isFilled = star <= activeRating;

                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSelectedRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                        aria-label={`Rate ${star} stars out of 5`}
                      >
                        <Star
                          size={26}
                          className={`transition-colors ${
                            isFilled
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* COMMENT INPUT */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike about this item?"
                rows={4}
                className="mt-5 w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm text-gray-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />

              {/* SUBMIT BUTTON */}
              <button
                type="button"
                disabled={submittingReview || comment.trim().length < 3}
                onClick={() => void handleSubmitReview()}
                className="mt-4 w-full rounded-xl bg-gray-900 py-3.5 text-sm font-bold text-white transition hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
              <p className="mt-3 text-center text-xs text-gray-400">
                One verified review permitted per product.
              </p>
            </div>

            {/* REVIEWS LIST */}
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Community Reviews
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    What customers say
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-900 ring-1 ring-inset ring-amber-500/20">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  <span>{Number(product.rating || 0).toFixed(1)}</span>
                </div>
              </div>

              {/* REVIEWS LIST STATES */}
              {reviewsLoading ? (
                <div className="mt-6 rounded-2xl border border-gray-200/80 bg-white p-8 text-center text-sm font-medium text-gray-400">
                  Loading customer reviews...
                </div>
              ) : reviews.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-dashed border-gray-200 bg-white/50 p-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <Star size={22} />
                  </div>
                  <h3 className="mt-3 text-base font-bold text-gray-800">
                    No reviews yet
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Be the first to leave feedback for this product.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {reviews.map((review) => {
                    const authorName = review.user?.name || "Anonymous";
                    const initial = authorName.charAt(0).toUpperCase();

                    return (
                      <article
                        key={review.id}
                        className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:border-gray-300"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {/* USER INITIAL AVATAR */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 font-bold text-xs text-white">
                              {initial}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">
                                {authorName}
                              </p>
                              {/* RATING STARS */}
                              <div className="mt-0.5 flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    size={13}
                                    className={
                                      star <= review.rating
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-gray-200"
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* DATE */}
                          <span className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        {/* COMMENT BODY */}
                        <p className="mt-3 text-sm leading-relaxed text-gray-600">
                          {review.comment}
                        </p>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;