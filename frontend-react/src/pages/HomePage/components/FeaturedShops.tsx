import { useState } from 'react';

interface Shop {
  id: string;
  name: string;
  category: string;
  logo: string;
  coverColor: string;
  logoBg: string;
  rating: number;
  reviews: number;
  status: 'open' | 'busy';
}

interface FeaturedShopsProps {
  onShopClick?: (shopId: string) => void;
  isLoading?: boolean;
}

const featuredShops: Shop[] = [
  {
    id: '1',
    name: 'Amani Botanics',
    category: 'Beauty & Wellness',
    logo: '🌿',
    coverColor: 'bg-[#f0ede8]',
    logoBg: 'bg-[#eaf4ef]',
    rating: 4.9,
    reviews: 312,
    status: 'open'
  },
  {
    id: '2',
    name: 'Zuri Threads',
    category: 'Fashion & Style',
    logo: '👗',
    coverColor: 'bg-[#fdf0e8]',
    logoBg: 'bg-[#fdf0e8]',
    rating: 4.7,
    reviews: 187,
    status: 'open'
  },
  {
    id: '3',
    name: 'TechNairobi',
    category: 'Electronics',
    logo: '📱',
    coverColor: 'bg-[#e8f0f8]',
    logoBg: 'bg-[#e8f0f8]',
    rating: 4.8,
    reviews: 524,
    status: 'busy'
  },
  {
    id: '4',
    name: "Mama's Pantry",
    category: 'Food & Groceries',
    logo: '🍯',
    coverColor: 'bg-[#f5f0e8]',
    logoBg: 'bg-[#f5f0e8]',
    rating: 4.9,
    reviews: 891,
    status: 'open'
  }
];

export const FeaturedShops = ({ onShopClick, isLoading = false }: FeaturedShopsProps) => {
  const [hoveredShop, setHoveredShop] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="mb-7">
        <div className="flex items-baseline justify-between mb-4">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="h-24 bg-gray-200 animate-pulse" />
              <div className="p-3.5">
                <div className="w-10 h-10 rounded-xl -mt-6 mb-2 bg-gray-200 animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-7">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-serif text-2xl font-normal">Featured Shops</h2>
        <button className="text-xs text-gray-500 hover:text-gray-900 border-b border-gray-200 hover:border-gray-900 transition-colors">
          View all →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredShops.map((shop) => (
          <div
            key={shop.id}
            onClick={() => onShopClick?.(shop.id)}
            onMouseEnter={() => setHoveredShop(shop.id)}
            onMouseLeave={() => setHoveredShop(null)}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            {/* Cover Image */}
            <div className={`h-24 flex items-center justify-center text-4xl ${shop.coverColor}`}>
              {shop.logo}
            </div>

            {/* Body */}
            <div className="p-3.5">
              {/* Logo */}
              <div className={`w-10 h-10 rounded-xl -mt-6 mb-2 flex items-center justify-center text-lg border-2 border-white ${shop.logoBg}`}>
                {shop.logo}
              </div>

              {/* Info */}
              <h3 className="font-medium text-sm mb-0.5">{shop.name}</h3>
              <p className="text-xs text-gray-400 mb-2.5">{shop.category}</p>

              {/* Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="text-amber-500">★</span>
                  <span>{shop.rating}</span>
                  <span className="text-gray-400">·</span>
                  <span>{shop.reviews} reviews</span>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  shop.status === 'open' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {shop.status === 'open' ? 'Open' : 'Busy'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};