import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="bg-[#111111]">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-16 sm:px-8 md:flex-row md:items-center lg:px-10">

        <div>
          <div className="flex items-center gap-2 text-[#F4D000]">
            <Sparkles size={18} />

            <span className="text-sm font-bold">
              AI SHOPPING ASSISTANT
            </span>
          </div>

          <h2 className="mt-3 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
            Don't search for hours.
            <br />
            Let AgentCart do it for you.
          </h2>
        </div>

        <button className="flex shrink-0 items-center gap-2 rounded-xl bg-[#F4D000] px-6 py-3.5 text-sm font-bold text-[#111111] transition hover:bg-[#e6c700]">
          Start Shopping
          <ArrowRight size={18} />
        </button>

      </div>
    </section>
  );
};

export default CTA;