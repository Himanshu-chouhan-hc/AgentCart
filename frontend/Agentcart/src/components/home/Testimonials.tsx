import { Star } from "lucide-react";

const reviews = [
  {
    name: "Aarav Sharma",
    role: "Verified Purchaser",
    comment: "The AI search saved me so much time. It recommended the exact backpack I was looking for in seconds.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Tech Enthusiast",
    comment: "Found great headphone deals with zero hassle. AgentCart is now my default shopping starting point.",
    rating: 5,
  },
  {
    name: "Rohan Verma",
    role: "Daily Shopper",
    comment: "Clean interface, fast navigation, and accurate product comparisons. Highly recommended!",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        
        <div className="text-center max-w-xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-wider text-[#b39a00]">
            User Reviews
          </p>
          <h2 className="mt-2 text-3xl font-bold text-[#111111]">
            Loved by shoppers everywhere
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((rev) => (
            <div
              key={rev.name}
              className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 transition hover:bg-white hover:shadow-md"
            >
              <div className="flex gap-1">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-[#F4D000] text-[#F4D000]" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">&quot;{rev.comment}&quot;</p>
              <div className="mt-6 border-t border-gray-200/60 pt-4">
                <p className="text-sm font-bold text-[#111111]">{rev.name}</p>
                <p className="text-xs text-gray-400">{rev.role}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;