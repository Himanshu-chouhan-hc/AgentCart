
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import TrendingProducts from "../components/home/TrendingProducts";
import CTA from "../components/home/CTA";

const Home = () => {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Hero />
      <Features />
      <TrendingProducts />
      <CTA />
    </main>
  );
};

export default Home;