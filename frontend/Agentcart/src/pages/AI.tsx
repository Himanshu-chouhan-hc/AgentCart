import { ArrowRight, Bot, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import AIShoppingAssistant from "../components/AIShoppingAssistant";

const AI = () => {
  return (
    <main className="ai-page">
      <section className="ai-page__intro">
        <div>
          <p className="ai-page__eyebrow"><Sparkles size={15} /> YOUR SHOPPING AGENT</p>
          <h1>Your personal shopping agent.</h1>
          <p className="ai-page__lede">Tell AgentCart what you need. It will find, compare, and help you shop using the products already in our catalog.</p>
          <Link to="/shop" className="ai-page__link">Browse the catalog <ArrowRight size={16} /></Link>
        </div>
        <div className="ai-page__signal"><Bot size={30} /><span>Ready when you are</span></div>
      </section>
      <section className="ai-page__workspace" aria-label="AgentCart AI workspace">
        <AIShoppingAssistant embedded />
      </section>
    </main>
  );
};

export default AI;
