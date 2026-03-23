export const Hero = () => {
  return (
    <div className="border border-gray-200 rounded-2xl p-10 mb-6 relative overflow-hidden">
      <div className="relative z-10">
        <div className="text-xs font-medium tracking-wider text-gray-400 uppercase mb-2.5">
          Kenya's Marketplace Network
        </div>
        <h1 className="font-serif text-4xl leading-tight mb-3.5 max-w-md">
          Shop local.<br />
          <em className="text-gray-500 not-italic">Support bold</em><br />
          businesses.
        </h1>
        <p className="text-sm text-gray-500 max-w-sm mb-5">
          Discover curated shops, exclusive deals, and the people behind every product.
        </p>
        <div className="flex gap-2.5">
          <button className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:opacity-90">
            Browse Offers
          </button>
          <button className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            Open a Shop
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 z-10">
        <div className="text-right">
          <div className="text-3xl font-serif">240+</div>
          <div className="text-xs text-gray-400">Active shops</div>
        </div>
        <div className="text-right mt-3.5">
          <div className="text-3xl font-serif">12k</div>
          <div className="text-xs text-gray-400">Products listed</div>
        </div>
        <div className="text-right mt-3.5">
          <div className="text-3xl font-serif">3.8k</div>
          <div className="text-xs text-gray-400">Daily shoppers</div>
        </div>
      </div>

      {/* Decorative circle */}
      <div className="absolute -right-14 -top-14 w-72 h-72 rounded-full bg-gray-100 opacity-60" />
    </div>
  );
};