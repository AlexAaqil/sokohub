export const SearchBar = () => {
  return (
    <div className="flex gap-2.5 mb-6">
        <div className="flex-1">
            <input 
                type="text" 
                placeholder="Search shops, products, categories..." className="w-full px-4 py-2.5 rounded-xl bg-white text-gray-900 text-sm outline-none border border-gray-200 focus:border-gray-400" />
        </div>

        <div>
            <button className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:opacity-90">Search</button>
        </div>
    </div>
  );
};