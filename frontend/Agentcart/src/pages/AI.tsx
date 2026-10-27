import { ArrowRight, Bot, Clock3, Heart, Lightbulb, MessageCircle, Search, ShoppingCart, Sparkles, WandSparkles } from "lucide-react";
import { Link } from "react-router-dom";
import AIShoppingAssistant from "../components/AIShoppingAssistant";

const quickActions = [
  { icon: Search, title: "Find Products", detail: "Search anything" },
  { icon: WandSparkles, title: "Compare Products", detail: "See side by side" },
  { icon: ShoppingCart, title: "Add to Cart", detail: "With your permission" },
  { icon: Heart, title: "Manage Wishlist", detail: "Save for later" },
];

const suggestions = [
  "Best laptop under 60000",
  "Headphones for music under 3000",
  "Add this to my cart",
  "Compare these two products",
  "Show me the latest deals",
  "Open my wishlist",
];

const conversations = [
  "Show me running shoes",
  "Add the second one to wishlist",
  "Best laptop for coding",
  "Compare these two phones",
];

const AI = () => (
  <main className="ai-page">
    <section className="ai-page__hero">
      <div className="ai-page__hero-copy">
        <p className="ai-page__eyebrow"><Sparkles size={14} /> AI SHOPPING ASSISTANT</p>
        <h1>Your Personal<br /><span>Shopping Agent</span></h1>
        <p className="ai-page__lede">Tell me what you need, and I'll help you find the best products, compare options, and even add them to your cart or wishlist.</p>
        <div className="ai-page__hero-actions"><Link to="/shop" className="ai-page__link">Browse the catalog <ArrowRight size={15} /></Link><span className="ai-page__status"><i /> Online now</span></div>
      </div>
      <div className="ai-page__hero-art" aria-hidden="true">
        <div className="ai-page__sun" /><div className="ai-page__spark ai-page__spark--one">✦</div><div className="ai-page__spark ai-page__spark--two">✦</div>
        <div className="ai-page__bot"><Bot size={78} strokeWidth={1.3} /><b>A</b></div>
        <div className="ai-page__float-card ai-page__float-card--note"><strong>Hi! I'm your<br />shopping agent</strong><small>How can I help you today?</small></div>
        <div className="ai-page__float-card ai-page__float-card--tag"><ShoppingCart size={13} /> Ready to shop</div>
      </div>
      <div className="ai-page__hero-features">
        <span><Lightbulb size={17} /><b>Find Products</b><small>By voice or text</small></span><span><WandSparkles size={17} /><b>Compare Options</b><small>Get the best choice</small></span><span><ShoppingCart size={17} /><b>Add to Cart</b><small>With your permission</small></span><span><Heart size={17} /><b>Manage Wishlist</b><small>Save what you love</small></span>
      </div>
    </section>
    <section className="ai-page__dashboard" aria-label="AgentCart AI workspace">
      <aside className="ai-page__sidebar">
        <section className="ai-page__side-panel"><h2><span><Lightbulb size={15} /></span> Quick Actions</h2><p>Get started with common tasks</p><div className="ai-page__quick-grid">{quickActions.map(({ icon: Icon, title, detail }) => <Link to="/ai" key={title}><span className="ai-page__quick-icon"><Icon size={16} /></span><b>{title}</b><small>{detail}</small><ArrowRight size={13} /></Link>)}</div></section>
        <section className="ai-page__side-panel"><h2><span><Sparkles size={15} /></span> Popular Suggestions</h2><p>Try saying these or speak them</p><div className="ai-page__pills">{suggestions.map((suggestion) => <button key={suggestion} type="button">{suggestion}</button>)}</div></section>
        <section className="ai-page__side-panel ai-page__recent"><h2><span><Clock3 size={15} /></span> Recent Conversations <small>View all</small></h2>{conversations.map((conversation, index) => <div key={conversation}><MessageCircle size={13} /><span>{conversation}</span><time>{index < 2 ? `${index + 2} hours ago` : index === 2 ? "5 hours ago" : "1 day ago"}</time></div>)}</section>
      </aside>
      <div className="ai-page__workspace"><AIShoppingAssistant embedded /></div>
    </section>
  </main>
);

export default AI;
