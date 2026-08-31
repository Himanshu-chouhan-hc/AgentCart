import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import {
  getCart,
  updateCartItem,
  removeCartItem,
  type Cart as CartData,
} from "../services/cartApi";

import "../styles/cart.css";

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_DELIVERY_FEE = 49;

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartData>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const loadCart = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await getCart();
      setCart(data);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not load your cart."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token =
      localStorage.getItem("agentcart_token") ||
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    void loadCart();
  }, [navigate]);

  const subtotal = useMemo(() => {
    return cart.items.reduce((total, item) => {
      return (
        total +
        Number(item.product.price) * item.quantity
      );
    }, 0);
  }, [cart.items]);

  const delivery =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_DELIVERY_FEE;

  const total = subtotal + delivery;

  const handleQuantityChange = async (
    itemId: string,
    quantity: number
  ) => {
    if (quantity < 1) return;

    try {
      setUpdating(itemId);
      setMessage("");

      await updateCartItem(itemId, quantity);

      const refreshedCart = await getCart();
      setCart(refreshedCart);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not update quantity."
      );
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      setUpdating(itemId);
      setMessage("");

      await removeCartItem(itemId);

      const refreshedCart = await getCart();
      setCart(refreshedCart);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not remove item."
      );
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <main className="cart-page">
        <div className="cart-empty">
          <ShoppingBag size={36} />
          <h2>Loading your cart...</h2>
          <p>We're getting your selected products ready.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-container">
        <header className="cart-header">
          <div>
            <Link to="/shop" className="back-link">
              <ArrowLeft size={16} />
              Continue shopping
            </Link>

            <p className="cart-eyebrow">YOUR PICKS</p>
            <h1>Your shopping cart</h1>
            <p className="cart-subtitle">
              Review your picks before checkout.
            </p>
          </div>

          <div className="cart-header-icon">
            <ShoppingBag size={30} />
            <span>{cart.items.length}</span>
          </div>
        </header>

        {message && <div className="cart-message">{message}</div>}

        {cart.items.length === 0 ? (
          <section className="cart-empty">
            <div className="cart-empty-icon">
              <ShoppingBag size={38} />
            </div>

            <h2>Your cart is empty.</h2>
            <p>Discover something worth keeping.</p>

            <Link to="/shop" className="cart-button">
              Explore products
              <ArrowRight size={17} />
            </Link>
          </section>
        ) : (
          <div className="cart-layout">
            <section className="cart-items-section">
              <div className="cart-items-heading">
                <h2>Your items</h2>
                <span>
                  {cart.items.length}{" "}
                  {cart.items.length === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="cart-items">
                {cart.items.map((item) => {
                  const price = Number(item.product.price);
                  const itemTotal = price * item.quantity;
                  const isUpdating = updating === item.id;

                  return (
                    <article className="cart-item" key={item.id}>
                      <Link
                        to={`/product/${item.product.id}`}
                        className="cart-item-image"
                      >
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                          />
                        ) : (
                          <ShoppingBag size={28} />
                        )}
                      </Link>

                      <div className="cart-item-info">
                        <p className="cart-item-category">
                          {item.product.category?.name ||
                            "AgentCart Pick"}
                        </p>

                        <Link to={`/product/${item.product.id}`}>
                          <h2>{item.product.name}</h2>
                        </Link>

                        <p className="cart-item-price">
                          ₹{price.toLocaleString("en-IN")}
                        </p>

                        <div className="quantity">
                          <button
                            type="button"
                            disabled={
                              Boolean(isUpdating) ||
                              item.quantity <= 1
                            }
                            onClick={() =>
                              void handleQuantityChange(
                                item.id,
                                item.quantity - 1
                              )
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>

                          <span>
                            {isUpdating ? "..." : item.quantity}
                          </span>

                          <button
                            type="button"
                            disabled={Boolean(isUpdating)}
                            onClick={() =>
                              void handleQuantityChange(
                                item.id,
                                item.quantity + 1
                              )
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-right">
                        <strong>
                          ₹{itemTotal.toLocaleString("en-IN")}
                        </strong>

                        <button
                          type="button"
                          className="remove-item"
                          disabled={Boolean(isUpdating)}
                          onClick={() => void handleRemove(item.id)}
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <aside className="cart-summary">
              <p className="summary-label">ORDER SUMMARY</p>

              <div className="summary-row">
                <span>Subtotal</span>
                <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
              </div>

              <div className="summary-row">
                <span>Delivery</span>
                <strong className={delivery === 0 ? "free" : ""}>
                  {delivery === 0 ? "FREE" : `₹${delivery}`}
                </strong>
              </div>

              {delivery > 0 && (
                <p className="delivery-note">
                  Add ₹
                  {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString(
                    "en-IN"
                  )}{" "}
                  more for free delivery.
                </p>
              )}

              <hr />

              <div className="cart-total">
                <span>Total</span>
                <strong>₹{total.toLocaleString("en-IN")}</strong>
              </div>

              <button
                type="button"
                className="cart-button checkout-button"
                disabled={cart.items.length === 0}
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>

              <div className="secure-checkout">
                🔒 Secure checkout
              </div>

              <Link to="/shop" className="summary-continue">
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;