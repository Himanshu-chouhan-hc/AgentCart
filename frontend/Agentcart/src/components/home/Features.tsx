import {
  Search,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Sparkles size={21} />,
      title: "AI Recommendations",
      description:
        "Get product suggestions based on your needs and preferences.",
    },
    {
      icon: <Search size={21} />,
      title: "Smart Search",
      description:
        "Describe what you want naturally and let AI find it.",
    },
    {
      icon: <TrendingUp size={21} />,
      title: "Better Deals",
      description:
        "Compare products and find options that fit your budget.",
    },
    {
      icon: <ShieldCheck size={21} />,
      title: "Secure Checkout",
      description:
        "Complete your purchase through a secure checkout experience.",
    },
  ];

  return (
    <section className="border-y border-gray-200 bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">

        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wider text-[#b39a00]">
            Why AgentCart?
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            A smarter way to shop.
          </h2>

          <p className="mt-3 text-gray-500">
            AgentCart combines AI with commerce to make
            shopping faster and easier.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100">
                {feature.icon}
              </div>

              <h3 className="mt-5 font-bold">
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