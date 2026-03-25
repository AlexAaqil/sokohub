import { useState, useEffect } from 'react';
import { productAPI, ProductWithShop } from '../../api/products';
import { CategoryPills } from './components/CategoryPills';
import { DealCard } from './components/DealCard';
import { FlashOfferCard } from './components/FlashOfferCard';
import { ClearanceCard } from './components/ClearanceCard';

export const DealsPage = () => {
  const [flashOffers, setFlashOffers] = useState<ProductWithShop[]>([]);
  const [clearanceItems, setClearanceItems] = useState<ProductWithShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [countdown, setCountdown] = useState({ hours: 8, minutes: 42, seconds: 17 });

  useEffect(() => {
    fetchDeals();
  }, [selectedCategory]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const params = selectedCategory !== 'All' ? { category: selectedCategory } : {};
      
      // Fetch flash offers (30%+ discount)
      const flashData = await productAPI.getDeals({ ...params, type: 'flash' });
      setFlashOffers(flashData);
      
      // Fetch clearance items (less than 30% discount)
      const clearanceData = await productAPI.getDeals({ ...params, type: 'clearance' });
      setClearanceItems(clearanceData);
    } catch (error) {
      console.error('Failed to fetch deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="pages_container">
      {/* Deals Banner */}
      <div className="bg-gray-900 text-white rounded-2xl p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif italic mb-2">Today's Best Deals</h1>
            <p className="text-sm text-gray-300">
              Fresh offers across all categories · Updated daily
            </p>
          </div>
          
          {/* Countdown Timer */}
          <div className="flex gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{formatNumber(countdown.hours)}</div>
              <div className="text-xs text-gray-400">HRS</div>
            </div>
            <div className="text-2xl font-bold text-gray-400">:</div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatNumber(countdown.minutes)}</div>
              <div className="text-xs text-gray-400">MIN</div>
            </div>
            <div className="text-2xl font-bold text-gray-400">:</div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatNumber(countdown.seconds)}</div>
              <div className="text-xs text-gray-400">SEC</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <CategoryPills
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Flash Offers Section */}
      {flashOffers.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-serif font-semibold">Flash Offers</h2>
            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              {flashOffers.length} active
            </span>
          </div>
          <div className="space-y-3 mb-12">
            {flashOffers.map(product => (
              <FlashOfferCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

      {/* Clearance Section */}
      {clearanceItems.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-serif font-semibold">Clearance</h2>
            <span className="text-xs text-gray-500">
              Last chance - limited stock
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {clearanceItems.map(product => (
              <ClearanceCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
          <p className="text-gray-500 mt-3">Loading deals...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && flashOffers.length === 0 && clearanceItems.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
          <div className="text-6xl mb-4">🏷️</div>
          <h2 className="text-xl font-semibold mb-2">No deals available</h2>
          <p className="text-gray-500">
            Check back soon for exciting offers!
          </p>
        </div>
      )}
    </div>
  );
};