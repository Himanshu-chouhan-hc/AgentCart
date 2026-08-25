import { useEffect, useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder, getCart, type Cart as CartData } from "../services/cartApi";
import "../styles/cart.css";

const Cart = () => {
  const [cart, setCart] = useState<CartData>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("agentcart_token")) { navigate("/login"); return; }
    getCart().then(setCart).catch((error) => setMessage(error instanceof Error ? error.message : "Could not load cart.")).finally(() => setLoading(false));
  }, [navigate]);

  const total = cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const placeOrder = async () => {
    setPlacingOrder(true);
    try {
      await createOrder(cart.items.map((item) => ({ productId: item.product.id, quantity: item.quantity })));
      setMessage("Order placed successfully.");
      setCart({ items: [] });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not place your order.");
    } finally { setPlacingOrder(false); }
  };

  if (loading) return <main className="cart-page"><div className="cart-empty">Loading your cart...</div></main>;
  return <main className="cart-page"><div className="cart-header"><div><Link to="/shop" className="back-link"><ArrowLeft size={16} /> Continue shopping</Link><p className="cart-eyebrow">YOUR PICKS</p><h1>Your shopping cart</h1></div><ShoppingBag size={34} /></div>{message && <p className="cart-message">{message}</p>}{cart.items.length === 0 ? <div className="cart-empty"><ShoppingBag size={36} /><h2>Your cart is ready for a good find.</h2><Link to="/shop" className="cart-button">Explore products</Link></div> : <div className="cart-layout"><div className="cart-items">{cart.items.map((item) => <article className="cart-item" key={item.id}><div className="cart-item-image">{item.product.image ? <img src={item.product.image} alt={item.product.name} /> : <ShoppingBag size={26} />}</div><div className="cart-item-info"><h2>{item.product.name}</h2><p>₹{Number(item.product.price).toLocaleString("en-IN")} each</p><div className="quantity"><button aria-label="Decrease quantity"><Minus size={14} /></button><span>{item.quantity}</span><button aria-label="Increase quantity"><Plus size={14} /></button></div></div><strong>₹{(Number(item.product.price) * item.quantity).toLocaleString("en-IN")}</strong></article>)}</div><aside className="cart-summary"><p>ORDER SUMMARY</p><div><span>Subtotal</span><strong>₹{total.toLocaleString("en-IN")}</strong></div><div><span>Delivery</span><strong>Free</strong></div><hr /><div className="cart-total"><span>Total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div><button className="cart-button" onClick={() => void placeOrder()} disabled={placingOrder}>{placingOrder ? "Placing order..." : "Place order"}</button></aside></div>}</main>;
};

export default Cart;
