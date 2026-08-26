import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import {
  getCart,
  createOrder,
  type CartItem,
} from "../services/cartApi";

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_DELIVERY_FEE = 49;

const Checkout = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  // ================================
  // LOAD CART
  // ================================
  useEffect(() => {
    let isMounted = true;

    const loadCheckout = async () => {
      const token =
        localStorage.getItem("agentcart_token") ||
        localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        setLoading(true);
        setError("");

        const cartData = await getCart();

        if (!isMounted) return;

        const rawCart = cartData as any;

        const apiItems: CartItem[] = Array.isArray(rawCart)
          ? rawCart
          : rawCart?.items ||
            rawCart?.data?.items ||
            rawCart?.data ||
            [];

        if (apiItems.length > 0) {
          setCartItems(apiItems);
        } else {
          // Backend cart empty hai
          const savedCart =
            localStorage.getItem("cart") ||
            localStorage.getItem("cartItems");

          if (savedCart) {
            try {
              const parsedCart = JSON.parse(savedCart);

              if (Array.isArray(parsedCart)) {
                setCartItems(parsedCart);
              } else {
                setCartItems([]);
              }
            } catch (err) {
              console.error(
                "Failed to parse local cart:",
                err
              );
              setCartItems([]);
            }
          } else {
            setCartItems([]);
          }
        }
      } catch (err) {
        console.error("Checkout cart loading error:", err);

        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your cart."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadCheckout();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // ================================
  // SUBTOTAL
  // ================================
  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item: any) => {
      const price = Number(
        item.product?.price ||
          item.price ||
          0
      );

      const quantity = Number(
        item.quantity || 1
      );

      return total + price * quantity;
    }, 0);
  }, [cartItems]);

  // ================================
  // DELIVERY FEE
  // ================================
  const deliveryFee =
    subtotal === 0 ||
    subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_DELIVERY_FEE;

  // ================================
  // TOTAL
  // ================================
  const total = subtotal + deliveryFee;

  // ================================
  // PLACE ORDER
  // ================================
  const handlePlaceOrder = async () => {
    if (placingOrder) return;

    if (!cartItems.length) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      // ----------------------------
      // CHECK TOKEN
      // ----------------------------
      const token =
        localStorage.getItem("agentcart_token") ||
        localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      // ----------------------------
      // FORMAT ITEMS
      // ----------------------------
      const formattedItems = cartItems.map(
        (item: any) => {
          const productId =
            item.product?.id ||
            item.product?._id ||
            item.productId ||
            item.id ||
            item._id;

          if (!productId) {
            throw new Error(
              "Product ID is missing for one of the items."
            );
          }

          return {
            productId: String(productId),
            quantity: Number(
              item.quantity || 1
            ),
          };
        }
      );

      // ----------------------------
      // ORDER PAYLOAD
      // ----------------------------
      const orderPayload = {
        items: formattedItems,
        totalAmount: total,
      };

      console.log(
        "Creating order:",
        orderPayload
      );

      // ----------------------------
      // BACKEND CREATE ORDER
      // ----------------------------
      const response = await createOrder(
        orderPayload as any
      );

      console.log(
        "Create order response:",
        response
      );

      // ----------------------------
      // EXTRACT ACTUAL ORDER
      // ----------------------------
      const responseData =
        (response as any)?.data ??
        response;

      const order =
        responseData?.order ??
        responseData;

      const orderId =
        order?.id ||
        order?._id;

      // ----------------------------
      // VERIFY ORDER ID
      // ----------------------------
      if (!orderId) {
        console.error(
          "Invalid createOrder response:",
          response
        );

        throw new Error(
          "Order was created but order ID was not returned by the server."
        );
      }

      // ----------------------------
      // CLEAR LOCAL CART
      // ----------------------------
      localStorage.removeItem("cart");
      localStorage.removeItem("cartItems");
      localStorage.removeItem(
        "agentcart_cart"
      );

      // ----------------------------
      // GO TO ORDER DETAILS
      // ----------------------------
      navigate(
        `/orders/${orderId}`,
        {
          replace: true,
        }
      );
    } catch (err: any) {
      console.error(
        "Order placement error:",
        err
      );

      setError(
        err?.message ||
          "Unable to place your order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // ================================
  // LOADING UI
  // ================================
  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-40 rounded bg-gray-200" />

            <div className="h-96 rounded-3xl bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  // ================================
  // EMPTY CART
  // ================================
  if (!cartItems.length) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-5 py-10">
        <div className="mx-auto max-w-3xl text-center">
          <ShoppingBag
            size={60}
            className="mx-auto text-gray-300"
          />

          <h1 className="mt-5 text-3xl font-bold">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Add some products before proceeding
            to checkout.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/cart")
            }
            className="mt-6 rounded-xl bg-[#F4D000] px-6 py-3 font-bold text-[#111]"
          >
            Return to Cart
          </button>
        </div>
      </main>
    );
  }

  // ================================
  // CHECKOUT UI
  // ================================
  return (
    <main className="min-h-screen bg-[#fafafa] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              AgentCart
            </p>

            <h1 className="text-3xl font-bold">
              Checkout
            </h1>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">

          {/* ================================
              PRODUCTS
          ================================= */}
          <section className="rounded-3xl border border-gray-200 bg-white p-6">

            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              ORDER ITEMS
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Your Products
            </h2>

            <div className="mt-6 space-y-4">

              {cartItems.map(
                (item: any, index: number) => {
                  const name =
                    item.product?.name ||
                    item.name ||
                    "Product";

                  const image =
                    item.product?.image ||
                    item.product?.images?.[0] ||
                    item.image;

                  const price = Number(
                    item.product?.price ||
                      item.price ||
                      0
                  );

                  const quantity = Number(
                    item.quantity || 1
                  );

                  return (
                    <div
                      key={
                        item.id ||
                        item._id ||
                        item.productId ||
                        index
                      }
                      className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >

                      {/* IMAGE */}
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        {image ? (
                          <img
                            src={image}
                            alt={name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ShoppingBag
                              size={20}
                              className="text-gray-300"
                            />
                          </div>
                        )}
                      </div>

                      {/* PRODUCT INFO */}
                      <div className="min-w-0 flex-1">

                        <h3 className="text-sm font-bold">
                          {name}
                        </h3>

                        <p className="text-xs text-gray-500">
                          Qty: {quantity}
                        </p>

                        <p className="text-sm font-semibold">
                          ₹
                          {price.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>

                      {/* ITEM TOTAL */}
                      <p className="text-sm font-bold">
                        ₹
                        {(
                          price * quantity
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>
                  );
                }
              )}

            </div>
          </section>

          {/* ================================
              SUMMARY
          ================================= */}
          <aside className="h-fit rounded-3xl border border-gray-200 bg-white p-6">

            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              SUMMARY
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">

              {/* SUBTOTAL */}
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-semibold">
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              {/* DELIVERY */}
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Delivery
                </span>

                <span className="font-semibold">
                  {deliveryFee === 0
                    ? "FREE"
                    : `₹${deliveryFee}`}
                </span>
              </div>

              {/* TOTAL */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">

                  <span className="text-base font-bold">
                    Total
                  </span>

                  <span className="text-xl font-bold">
                    ₹
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>
              </div>
            </div>

            {/* PLACE ORDER */}
            <button
              type="button"
              disabled={placingOrder}
              onClick={handlePlaceOrder}
              className="mt-6 w-full rounded-xl bg-[#F4D000] px-5 py-4 text-sm font-bold text-[#111] transition hover:bg-[#e6c700] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {placingOrder
                ? "Placing Order..."
                : "Place Order"}
            </button>

          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;