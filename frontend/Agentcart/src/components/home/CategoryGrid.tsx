import { useNavigate } from "react-router-dom";
import { Headphones, Laptop, Shirt, Watch, Footprints } from "lucide-react";

const categories = [
  { name: "Audio & Sound", count: "120+ Products", icon: <Headphones size={24} />, query: "audio" },
  { name: "Electronics", count: "85+ Products", icon: <Laptop size={24} />, query: "electronics" },
  { name: "Fashion & Apparel", count: "210+ Products", icon: <Shirt size={24} />, query: "fashion" },
  { name: "Footwear", count: "95+ Products", icon: <Footprints size={24} />, query: "footwear" },
  { name: "Wearables", count: "60+ Products", icon: <Watch size={24} />, query: "wearables" },
];

const CategoryGrid = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-[#b39a00]">
            Categories
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111111]">
            Explore by category
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => navigate(`/shop?category=${cat.query}`)}
              className="flex flex-col items-center rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center transition hover:-translate-y-1 hover:border-[#F4D000] hover:bg-white hover:shadow-md active:scale-95"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-[#111111]">
                {cat.icon}
              </div>
              <h3 className="mt-4 text-sm font-bold text-[#111111]">{cat.name}</h3>
              <span className="mt-1 text-xs text-gray-500">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;