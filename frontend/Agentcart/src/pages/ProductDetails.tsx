import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Star,
} from "lucide-react";

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

  const [notice, setNotice] = useState("");
  const [adding, setAdding] = useState(false);

  const [selectedRating, setSelectedRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Load product
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        setNotice(
          error instanceof Error
            ? error.message
            : "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
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
      setNotice("");

      await addToCart(product.id);

      setNotice("Added to your cart.");
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not add product to cart."
      );
    } finally {
      setAdding(false);
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
      setNotice("Review must be at least 3 characters.");
      return;
    }

    try {
      setSubmittingReview(true);
      setNotice("");

      const newReview = await createReview(
        id,
        selectedRating,
        comment.trim()
      );

      setReviews((prev) => [newReview, ...prev]);

      const ratingUsed = selectedRating;

      setComment("");
      setSelectedRating(5);

      // Update rating immediately
      setProduct((prev) => {
        if (!prev) return prev;

        const oldCount = prev.reviewCount || 0;
        const newCount = oldCount + 1;

        const newRating =
          ((Number(prev.rating) || 0) * oldCount +
            ratingUsed) /
          newCount;

        return {
          ...prev,
          rating: newRating,
          reviewCount: newCount,
        };
      });

      setNotice("Review submitted successfully.");
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not submit review."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="h-6 w-24 rounded bg-gray-200" />

            <div className="mt-8 grid gap-10 lg:grid-cols-2">
              <div className="h-[500px] rounded-2xl bg-gray-200" />

              <div>
                <div className="h-8 w-3/4 rounded bg-gray-200" />
                <div className="mt-5 h-6 w-32 rounded bg-gray-200" />
                <div className="mt-8 h-24 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Product not found
  if (!product) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-5 py-10">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-2xl font-bold">
            Product not found
          </h1>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="mt-5 rounded-xl bg-[#111] px-5 py-3 text-sm font-bold text-white"
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

        {/* BACK */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
        >
          <ArrowLeft size={17} />
          Back to Shop
        </button>

        {/* NOTICE */}
        {notice && (
          <div className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {notice}
          </div>
        )}

        {/* PRODUCT */}
        <div className="mt-8 grid gap-10 lg:grid-cols-2">

          {/* IMAGE */}
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full max-h-[600px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[500px] items-center justify-center">
                <ShoppingBag size={60} />
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="flex flex-col justify-center">

            <p className="text-sm font-bold uppercase tracking-wider text-gray-500">
              {product.category?.name || "Curated Product"}
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              {product.name}
            </h1>

            {product.brand && (
              <p className="mt-2 text-gray-500">
                by {product.brand}
              </p>
            )}

            {/* RATING */}
            <div className="mt-5 flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg bg-yellow-100 px-3 py-1.5 text-sm font-bold">
                <Star
                  size={15}
                  fill="currentColor"
                />

                {Number(product.rating || 0).toFixed(1)}
              </div>

              <span className="text-sm text-gray-500">
                {product.reviewCount || 0} reviews
              </span>
            </div>

            {/* PRICE */}
            <div className="mt-7">
              <span className="text-3xl font-bold">
                ₹
                {Number(product.price).toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-6 leading-7 text-gray-600">
              {product.description ||
                "A carefully selected product from the AgentCart collection."}
            </p>

            {/* STOCK */}
            <div className="mt-6">
              {product.stock > 0 ? (
                <span className="text-sm font-semibold text-green-600">
                  ✓ In stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-sm font-semibold text-red-500">
                  Out of stock
                </span>
              )}
            </div>

            {/* AI SUGGESTION */}
            <div className="mt-7 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                ✨ AI Shopping Assistant
              </p>

              <h3 className="mt-2 font-bold">
                Why you might like this
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                This product has a{" "}
                {Number(product.rating || 0).toFixed(1)}
                /5 rating and is a popular choice in the{" "}
                {product.category?.name || "selected"} category.
                AgentCart recommends it based on product quality,
                customer reviews and availability.
              </p>
            </div>

            {/* ADD TO CART */}
            <div className="mt-7">

              <button
                type="button"
                disabled={
                  adding || product.stock <= 0
                }
                onClick={() => void handleAddToCart()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F4D000] px-5 py-4 text-sm font-bold text-[#111] transition hover:bg-[#e6c700] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag size={18} />

                {adding
                  ? "Adding..."
                  : "Add to Cart"}
              </button>

            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <section className="mt-16 border-t border-gray-200 pt-12">

          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">

            {/* WRITE REVIEW */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6">

              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                CUSTOMER FEEDBACK
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Write a review
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Share your experience with this product.
              </p>

              {/* STAR SELECTOR */}
              <div className="mt-6">

                <p className="mb-3 text-sm font-semibold">
                  Your rating
                </p>

                <div className="flex gap-2">

                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setSelectedRating(star)
                      }
                      className="transition hover:scale-110"
                      aria-label={`${star} star rating`}
                    >
                      <Star
                        size={28}
                        fill={
                          star <= selectedRating
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          star <= selectedRating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}

                </div>
              </div>

              {/* COMMENT */}
              <textarea
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
                placeholder="Write your review..."
                rows={5}
                className="mt-6 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
              />

              {/* SUBMIT */}
              <button
                type="button"
                disabled={
                  submittingReview ||
                  comment.trim().length < 3
                }
                onClick={() =>
                  void handleSubmitReview()
                }
                className="mt-4 w-full rounded-xl bg-[#111] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submittingReview
                  ? "Submitting..."
                  : "Submit review"}
              </button>

              <p className="mt-3 text-center text-xs text-gray-400">
                You can submit only one review for this product.
              </p>

            </div>

            {/* REVIEWS LIST */}
            <div>

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    REVIEWS
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    What customers say
                  </h2>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-yellow-100 px-4 py-2">

                  <Star
                    size={18}
                    fill="currentColor"
                    className="text-yellow-500"
                  />

                  <span className="font-bold">
                    {Number(product.rating || 0).toFixed(1)}
                  </span>

                </div>
              </div>

              {/* LOADING */}
              {reviewsLoading ? (
                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
                  Loading reviews...
                </div>

              ) : reviews.length === 0 ? (

                /* EMPTY */
                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-center">

                  <Star
                    size={32}
                    className="mx-auto text-gray-300"
                  />

                  <h3 className="mt-3 font-bold">
                    No reviews yet
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Be the first person to review this product.
                  </p>

                </div>

              ) : (

                /* REVIEW ITEMS */
                <div className="mt-6 space-y-4">

                  {reviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-2xl border border-gray-200 bg-white p-5"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <p className="font-bold">
                            {review.user.name}
                          </p>

                          <div className="mt-1 flex gap-0.5">

                            {[1, 2, 3, 4, 5].map(
                              (star) => (
                                <Star
                                  key={star}
                                  size={15}
                                  fill={
                                    star <= review.rating
                                      ? "currentColor"
                                      : "none"
                                  }
                                  className={
                                    star <= review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }
                                />
                              )
                            )}

                          </div>

                        </div>

                        <span className="text-xs text-gray-400">
                          {new Date(
                            review.createdAt
                          ).toLocaleDateString("en-IN")}
                        </span>

                      </div>

                      <p className="mt-4 text-sm leading-6 text-gray-600">
                        {review.comment}
                      </p>

                    </article>
                  ))}

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