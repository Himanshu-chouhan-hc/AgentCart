import { useNavigate } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

const products = [
  {
    id: "1",
    name: "Urban Runner Pro",
    category: "Running Shoes",
    price: "₹2,499",
    rating: "4.8",
  },
  {
    id: "2",
    name: "Minimal Backpack",
    category: "Backpacks",
    price: "₹1,799",
    rating: "4.7",
  },
  {
    id: "3",
    name: "Everyday Headphones",
    category: "Audio",
    price: "₹2,999",
    rating: "4.6",
  },
  {
    id: "4",
    name: "Smart Watch Pro",
    category: "Wearables",
    price: "₹4,499",
    rating: "4.8",
  },
];

const TrendingProducts = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#fafafa] py-16 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#b39a00]">
              Discover
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#111111]">
              Trending products
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="hidden items-center gap-1.5 text-sm font-bold text-[#111111] transition hover:text-[#b39a00] sm:flex"
          >
            <span>View all</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Product Image Box */}
              <div className="flex h-48 items-center justify-center bg-gray-100">
                <div className="h-24 w-24 rounded-2xl bg-gray-200 transition duration-200 group-hover:scale-105" />
              </div>

              <div className="p-4">
                <p className="text-xs font-medium text-gray-400">
                  {product.category}
                </p>

                <h3 className="mt-1 truncate font-bold text-[#111111]">
                  {product.name}
                </h3>

                <div className="mt-2 flex items-center gap-1">
                  <Star size={14} className="fill-[#F4D000] text-[#F4D000]" />
                  <span className="text-xs font-semibold text-gray-700">
                    {product.rating}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-[#111111]">
                    {product.price}
                  </span>

                  <button
                    type="button"
                    onClick={() => navigate(`/shop`)}
                    className="rounded-lg bg-[#F4D000] px-3 py-2 text-xs font-bold text-[#111111] transition hover:bg-[#e6c700] active:scale-95"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-6 text-center sm:hidden">
          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-[#111111]"
          >
            <span>View all products</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default TrendingProducts;