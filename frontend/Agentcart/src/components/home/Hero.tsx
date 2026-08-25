import { ArrowRight, Search, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-24">

        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2">
            <Sparkles size={15} />

            <span className="text-xs font-semibold">
              AI-powered commerce
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Shopping that
            <br />

            <span className="text-[#F4D000]">
              thinks for you.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
            Tell AgentCart what you need. Our AI discovers,
            compares and helps you make the right purchase.
          </p>

          {/* AI Search */}
          <div className="mt-8 flex max-w-xl items-center rounded-2xl border border-gray-300 bg-white p-2 shadow-sm focus-within:border-[#F4D000] focus-within:ring-4 focus-within:ring-yellow-100">
            <Search
              size={19}
              className="ml-3 text-gray-400"
            />

            <input
              type="text"
              placeholder="Ask AI what you want to buy..."
              className="h-11 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-gray-400"
            />

            <button className="rounded-xl bg-[#F4D000] px-5 py-3 text-sm font-bold transition hover:bg-[#e6c700]">
              Ask AI
            </button>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-[#111111] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800">
              Explore Products
              <ArrowRight size={17} />
            </button>

            <button className="rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold transition hover:bg-gray-50">
              How it works
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="relative flex items-center justify-center">

          {/* Yellow glow */}
          <div className="absolute h-80 w-80 rounded-full bg-yellow-200/40 blur-3xl" />

          {/* Gemini image */}
          <img
            src="/images/agentcart-hero.png.jpg"
            alt="AgentCart AI shopping"
            className="relative z-10 w-full max-w-xl object-contain"
          />

        </div>
      </div>
    </section>
  );
};

export default Hero;