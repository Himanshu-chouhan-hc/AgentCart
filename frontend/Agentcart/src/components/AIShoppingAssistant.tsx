import { useState } from "react";
import { Bot, Check, Heart, Mic, Send, ShoppingCart, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addToCart, getCart, removeCartItem } from "../services/cartApi";
import { addToWishlist } from "../services/wishlistApi";
import { sendAIChat, type AIChatAction, type AIChatMessage, type AIChatResult } from "../services/aiApi";
import type { Product } from "../services/productApi";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import "../styles/aiAssistant.css";

const purchaseWords = /\b(buy|purchase|order)\b/i;
const confirmationWords = /^(yes|yeah|yep|confirm|go ahead|do it|sure)\b/i;

const AIShoppingAssistant = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AIChatMessage[]>([
    { role: "assistant", content: "Hey! What are you shopping for?" },
  ]);
  const [products, setProducts] = useState<Product[]>([]);
    const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [pendingPurchase, setPendingPurchase] = useState<AIChatAction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isListening, isSupported, toggleListening } = useSpeechRecognition(setInput);

  const showMessage = (content: string) => setMessages((current) => [...current, { role: "assistant", content }]);
  const quickSuggestions = ["Find products", "Best deals", "My cart", "My wishlist"];
  const contextSuggestions = ["Add this to cart", "Add to wishlist", "Compare", "Buy this"];

  const executeAction = async (action: AIChatAction) => {
    if (!action.productId && ["ADD_TO_CART", "ADD_TO_WISHLIST", "REMOVE_FROM_CART", "VIEW_PRODUCT"].includes(action.type)) {
      showMessage("Sorry, I couldn't identify the product. Please select one from the results.");
      return;
    }

    try {
      if (action.type === "ADD_TO_CART") {
        await addToCart(action.productId!, action.quantity || 1);
        showMessage("Added to cart successfully.");
      } else if (action.type === "ADD_TO_WISHLIST") {
        await addToWishlist(action.productId!);
        showMessage("Added to your wishlist.");
      } else if (action.type === "REMOVE_FROM_CART") {
        const cart = await getCart();
        const item = cart.items.find((cartItem) => cartItem.product.id === action.productId);
        if (!item) throw new Error("That product is not in your cart.");
        await removeCartItem(item.id);
        showMessage("Removed from your cart.");
      } else if (action.type === "VIEW_PRODUCT") {
        navigate(`/products/${action.productId}`);
        showMessage("Opening the product.");
      } else if (action.type === "OPEN_CART") {
        navigate("/cart");
      } else if (action.type === "OPEN_CHECKOUT") {
        navigate("/checkout");
      } else if (action.type === "COMPARE_PRODUCTS") {
        showMessage("Comparison uses only the product information available in the catalog.");
      }
    } catch (actionError) {
      const message = action.type === "ADD_TO_WISHLIST" ? "I couldn't update your wishlist. Please try again." : action.type === "ADD_TO_CART" ? "I couldn't add that product to your cart. Please try again." : actionError instanceof Error ? actionError.message : "I couldn't complete that action. Please try again.";
      showMessage(message);
    }
  };

  const submit = async (event?: React.FormEvent, submittedInput?: string) => {
    event?.preventDefault();
    const message = (submittedInput || input).trim();
    if (!message || loading) return;
    setInput("");
    setError("");

    if (pendingPurchase && confirmationWords.test(message)) {
      setPendingPurchase(null);
      setMessages((current) => [...current, { role: "user", content: message }]);
      await executeAction(pendingPurchase);
      navigate("/checkout");
      return;
    }

    const nextMessages = [...messages, { role: "user" as const, content: message }];
    setMessages(nextMessages);
    setLoading(true);
    try {
      const result: AIChatResult = await sendAIChat(message, nextMessages, products.map((product) => product.id));
      setProducts(result.products || []);
        setComparisonIds(result.action.type === "COMPARE_PRODUCTS" ? result.action.productIds || [] : []);
      setMessages((current) => [...current, { role: "assistant", content: result.reply }]);
      if (result.action.type === "ADD_TO_CART" && purchaseWords.test(message)) {
        setPendingPurchase(result.action);
        showMessage("Would you like me to add this to your cart and continue to checkout?");
      } else if (result.action.type !== "NONE") {
        await executeAction(result.action);
      }
    } catch (chatError) {
      setError(chatError instanceof Error ? chatError.message : "AI service is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant">
      {isOpen && (
        <section className="ai-assistant-panel" aria-label="AgentCart AI shopping assistant">
          <header className="ai-assistant-header"><div className="ai-assistant-title"><span className="ai-assistant-logo"><Sparkles size={15} /></span><span><strong>AgentCart AI</strong><small>Shopping Assistant</small></span></div><div className="ai-assistant-status"><span /> Ready</div><button type="button" onClick={() => setIsOpen(false)} aria-label="Close assistant"><X size={17} /></button></header>
          <div className="ai-assistant-messages">
            {messages.length === 1 && <div className="ai-assistant-welcome"><span className="ai-welcome-icon"><Sparkles size={18} /></span><div><h2>Hey! What are you shopping for?</h2><p>Ask me to find products, compare options, manage your cart or wishlist.</p></div><div className="ai-suggestion-list">{quickSuggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => void submit(undefined, suggestion)}>{suggestion}</button>)}</div></div>}
            {messages.slice(1).map((message, index) => <p className={`ai-message ai-message-${message.role}`} key={`${message.role}-${index + 1}`}>{message.content}</p>)}
            {loading && <p className="ai-message ai-message-assistant">Thinking...</p>}
            {error && <p className="ai-message ai-message-error">{error}</p>}
            {messages.length > 1 && <div className="ai-context-actions"><span>Quick actions</span>{contextSuggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => void submit(undefined, suggestion)}>{suggestion}</button>)}</div>}
            {products.length > 0 && <div className="ai-chat-products">{products.slice(0, 3).map((product) => <article key={product.id}>
              <div className="ai-chat-product-image">{product.image ? <img src={product.image} alt={product.name} /> : <ShoppingCart size={18} />}</div>
              <strong>{product.name}</strong><span className="ai-product-price">₹{Number(product.price).toLocaleString("en-IN")}</span>
              <small className="ai-product-reason">A thoughtful match for your search</small>
              <div className="ai-product-actions"><button type="button" onClick={() => void executeAction({ type: "ADD_TO_CART", productId: product.id, quantity: 1 })} title="Add to cart"><ShoppingCart size={13} /> Add</button><button type="button" onClick={() => void executeAction({ type: "ADD_TO_WISHLIST", productId: product.id })} title="Add to wishlist"><Heart size={13} /> Save</button><button type="button" onClick={() => void executeAction({ type: "VIEW_PRODUCT", productId: product.id })} title="View product"><Check size={13} /> View</button></div>
            </article>)}</div>}
                      {comparisonIds.length >= 2 && <div className="ai-comparison"><strong>Catalog comparison</strong>{comparisonIds.map((id) => { const product = products.find((item) => item.id === id); return product ? <div key={product.id}><b>{product.name}</b><span>Price: ₹{Number(product.price).toLocaleString("en-IN")}</span><span>Brand: {product.brand || "Unavailable"}</span><span>Category: {product.category?.name || "Unavailable"}</span><span>Description: {product.description || "Unavailable"}</span></div> : null; })}</div>}
          </div>
          <form className="ai-assistant-input" onSubmit={(event) => void submit(event)}>
            {isSupported && <button type="button" className={`ai-voice-button ${isListening ? "listening" : ""}`} onClick={toggleListening} aria-label="Use voice"><Mic size={16} />{isListening && <span>Listening...</span>}</button>}
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask AgentCart anything..." aria-label="Ask AgentCart AI" />
            <button className="ai-send-button" type="submit" aria-label="Send message" disabled={loading}><Send size={16} /></button>
          </form>
        </section>
      )}
      <button type="button" className="ai-assistant-trigger" onClick={() => setIsOpen((open) => !open)} aria-label="Open AgentCart AI"><Bot size={21} /><span className="ai-trigger-pulse" /></button>
    </div>
  );
};

export default AIShoppingAssistant;