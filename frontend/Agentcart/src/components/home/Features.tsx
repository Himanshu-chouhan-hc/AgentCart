import { Search, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Sparkles size={21} className="text-[#111111]" />,
      title: "AI Recommendations",
      description: "Get product suggestions based on your specific needs and preferences.",
    },
    {
      icon: <Search size={21} className="text-[#111111]" />,
      title: "Smart Search",
      description: "Describe what you want naturally and let AI locate the right item.",
    },
    {
      icon: <TrendingUp size={21} className="text-[#111111]" />,
      title: "Better Deals",
      description: "Compare products easily and find options that match your budget.",
    },
    {
      icon: <ShieldCheck size={21} className="text-[#111111]" />,
      title: "Secure Checkout",
      description: "Complete your purchase smoothly through encrypted checkout options.",
    },
  ];

  return (
    <section id="features" className="border-y border-gray-200 bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wider text-[#b39a00]">
            Why AgentCart?
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
            A smarter way to shop online.
          </h2>
          <p className="mt-3 text-gray-500">
            AgentCart combines AI discovery with automated price tracking to streamline your purchase journey.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="home-feature group rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4D000] transition group-hover:scale-110">
                {feature.icon}
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#111111]">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;