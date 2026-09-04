import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import CategoryGrid from "../components/home/CategoryGrid";
import TrendingProducts from "../components/home/TrendingProducts";
import AIAssistantBanner from "../components/home/AIAssistantBanner";
import Testimonials from "../components/home/Testimonials";
import CTA from "../components/home/CTA";

const Home = () => {
  return (
    <main className="home-page min-h-screen bg-[#fafafa] text-[#111111]">
      {/* 1. Hero Section - Primary Hook & Search CTA */}
      <Hero />

      {/* 2. Value Propositions - Free shipping, secure pay, AI support */}
      <Features />

      {/* 3. Visual Categories - Quick access to key collections */}
      <CategoryGrid />

      {/* 4. Trending Products - High-conversion product showcase */}
      <TrendingProducts />

      {/* 5. AI Shopping Spotlight - Explains AgentCart's core feature */}
      <AIAssistantBanner />

      {/* 6. Social Proof - Reviews & Trust Badges */}
      <Testimonials />

      {/* 7. Final Call to Action & Lead Capture */}
      <CTA />
    </main>
  );
};

export default Home;