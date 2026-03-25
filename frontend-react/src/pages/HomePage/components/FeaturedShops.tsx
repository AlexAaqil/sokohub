import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopAPI, Shop } from '../../../api/shops';

export const FeaturedShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const data = await shopAPI.getAll();
        setShops(data);
      } catch (error) {
        console.error('Failed to fetch shops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  if (loading) {
    return (
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-serif font-semibold">Featured Shops</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
              <div className="h-24 bg-gray-200 rounded-lg mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (shops.length === 0) {
    return (
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-serif font-semibold">Featured Shops</h2>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500">
          No shops yet. Be the first to create one!
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-serif font-semibold">Featured Shops</h2>
        <button className="text-sm text-gray-500 hover:text-gray-700">
          View all →
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {shops.map(shop => (
          <div
            key={shop.id}
            onClick={() => navigate(`/shop/${shop.id}`)}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="h-24 bg-gray-100 flex items-center justify-center text-3xl">
              {shop.logo_url ? (
                <img src={shop.logo_url} alt={shop.name} className="h-full w-full object-cover" />
              ) : (
                <span>🏪</span>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-medium text-gray-900">{shop.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{shop.category || 'General'}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-green-600">Open</span>
                <span className="text-xs text-gray-400">★ 4.8</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};