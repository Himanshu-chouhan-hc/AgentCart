import { Bot, CheckCircle, Cpu, Zap } from "lucide-react";

const AIAssistantBanner = () => {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-yellow-50 via-white to-gray-50 p-8 lg:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-lg bg-yellow-200/60 px-3 py-1 text-xs font-bold text-[#111111]">
                <Bot size={16} />
                <span>Next-Gen Commerce Engine</span>
              </div>

              <h2 className="mt-4 text-3xl font-extrabold text-[#111111] sm:text-4xl">
                Let AI curate choices based on your exact budget.
              </h2>

              <p className="mt-3 text-base text-gray-600">
                Forget sifting through hundreds of irrelevant reviews. AgentCart filters products by real-time user feedback, verified seller ratings, and price history.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-800">
                  <CheckCircle size={17} className="text-[#b39a00]" />
                  <span>Personalized recommendations</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-800">
                  <Zap size={17} className="text-[#b39a00]" />
                  <span>Instant price comparisons</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-800">
                  <Cpu size={17} className="text-[#b39a00]" />
                  <span>Automated search filters</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-800">
                  <CheckCircle size={17} className="text-[#b39a00]" />
                  <span>Verified buyer ratings</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4D000]">
                    <Bot size={18} />
                  </div>
                  <span className="text-xs font-bold">AgentCart Smart Assistant</span>
                </div>
                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="rounded-xl bg-gray-100 p-3 text-gray-700">
                    &quot;Show me noise cancelling headphones under ₹3,000.&quot;
                  </div>
                  <div className="rounded-xl bg-yellow-100/70 p-3 text-[#111111] font-medium">
                    &quot;Found Everyday Headphones at ₹2,999 with 4.6★ rating.&quot;
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAssistantBanner;