import { ArrowRight, Star } from "lucide-react";

const products = [
  {
    name: "Urban Runner Pro",
    category: "Running Shoes",
    price: "₹2,499",
    rating: "4.8",
  },
  {
    name: "Minimal Backpack",
    category: "Backpacks",
    price: "₹1,799",
    rating: "4.7",
  },
  {
    name: "Everyday Headphones",
    category: "Audio",
    price: "₹2,999",
    rating: "4.6",
  },
  {
    name: "Smart Watch Pro",
    category: "Wearables",
    price: "₹4,499",
    rating: "4.8",
  },
];

const TrendingProducts = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">

        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#b39a00]">
              Discover
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Trending products
            </h2>
          </div>

          <button className="hidden items-center gap-1 text-sm font-bold sm:flex">
            View all
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.name}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image placeholder */}
              <div className="flex h-48 items-center justify-center bg-gray-100">
                <div className="h-24 w-24 rounded-2xl bg-gray-200 transition group-hover:scale-105" />
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-400">
                  {product.category}
                </p>

                <h3 className="mt-1 truncate font-bold">
                  {product.name}
                </h3>

                <div className="mt-2 flex items-center gap-1">
                  <Star
                    size={14}
                    className="fill-[#F4D000] text-[#F4D000]"
                  />

                  <span className="text-xs font-semibold">
                    {product.rating}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold">
                    {product.price}
                  </span>

                  <button className="rounded-lg bg-[#F4D000] px-3 py-2 text-xs font-bold">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TrendingProducts;