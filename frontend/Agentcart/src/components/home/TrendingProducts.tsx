import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

import { getProducts, type Product } from "../../services/productApi";

const formatPrice = (value: number | string) => {
  const numericValue = Number(value ?? 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericValue);
};

const TrendingProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrendingProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getProducts();
        setProducts(allProducts.slice(0, 4));
      } catch (error) {
        console.error("Failed to load trending products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    void loadTrendingProducts();
  }, []);

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

        {loading ? (
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-2xl border border-gray-200 bg-gray-100"
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-48 items-center justify-center overflow-hidden bg-gray-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-2xl bg-gray-200 transition duration-200 group-hover:scale-105" />
                  )}
                </div>

                <div className="p-4">
                  <p className="text-xs font-medium text-gray-400">
                    {product.category?.name || "General"}
                  </p>

                  <h3 className="mt-1 truncate font-bold text-[#111111]">
                    {product.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-1">
                    <Star size={14} className="fill-[#F4D000] text-[#F4D000]" />
                    <span className="text-xs font-semibold text-gray-700">
                      {product.rating || 0}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-[#111111]">
                      {formatPrice(product.price)}
                    </span>

                    <button
                      type="button"
                      onClick={() => navigate("/shop")}
                      className="rounded-lg bg-[#F4D000] px-3 py-2 text-xs font-bold text-[#111111] transition hover:bg-[#e6c700] active:scale-95"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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