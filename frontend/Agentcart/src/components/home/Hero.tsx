import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mic, Search, Sparkles } from "lucide-react";
import { getAIRecommendations } from "../../services/aiApi";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";

const Hero = () => {
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isListening, toggleListening } = useSpeechRecognition(setQuery);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await getAIRecommendations(trimmedQuery);

      navigate("/shop", {
        state: {
          aiQuery: trimmedQuery,
          aiProducts: result.recommendations.map((recommendation) => recommendation.product),
          aiRecommendations: result.recommendations,
          aiMessage: result.message,
        },
      });
    } catch (error) {
      console.error("AI search failed:", error);
      navigate(`/shop?search=${encodeURIComponent(trimmedQuery)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoiceSearch = () => {
    toggleListening();
  };

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2 text-[#111111]">
            <Sparkles size={15} className="text-[#b39a00]" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              AI-Powered Commerce
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#111111] sm:text-6xl">
            Shopping that <br />
            <span className="bg-gradient-to-r from-[#F4D000] to-[#b39a00] bg-clip-text text-transparent">
              thinks for you.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
            Tell AgentCart what you need. Our AI discovers, compares options, and finds the best deals tailored specifically to your preferences.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex max-w-xl items-center rounded-2xl border border-gray-300 bg-white p-2 shadow-sm transition-all focus-within:border-[#F4D000] focus-within:ring-4 focus-within:ring-yellow-100"
          >
            <Search size={19} className="ml-3 text-gray-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask AI what you want to buy..."
              className="h-11 flex-1 bg-transparent px-3 text-sm text-[#111111] outline-none placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`mr-2 rounded-full p-2 transition ${isListening ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              aria-label="Voice search"
              title="Voice search"
            >
              <Mic size={18} />
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#F4D000] px-5 py-3 text-sm font-bold text-[#111111] transition hover:bg-[#e6c700] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 shrink-0"
            >
              {isSubmitting ? "Searching..." : "Ask AI"}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="flex items-center gap-2 rounded-xl bg-[#111111] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800 active:scale-95"
            >
              Explore Products
              <ArrowRight size={17} />
            </button>

            <a
              href="#features"
              className="rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-95"
            >
              How it works
            </a>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute h-72 w-72 rounded-full bg-yellow-200/50 blur-3xl sm:h-96 sm:w-96" />
          <img
            src="/images/agentcart-hero.png.jpg"
            alt="AgentCart AI Shopping Experience"
            className="relative z-10 w-full max-w-md rounded-2xl object-contain shadow-lg sm:max-w-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;