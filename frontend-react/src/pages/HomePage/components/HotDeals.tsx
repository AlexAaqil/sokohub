import { useState } from 'react';

interface Deal {
  id: string;
  name: string;
  shop: string;
  icon: string;
  discount: number;
  originalPrice: number;
  currentPrice: number;
}

const hotDeals: Deal[] = [
  {
    id: '1',
    name: 'Aloe Vera Serum 50ml',
    shop: 'Amani Botanics',
    icon: '🧴',
    discount: 40,
    originalPrice: 1200,
    currentPrice: 720
  },
  {
    id: '2',
    name: 'Ankara Sneakers',
    shop: 'Zuri Threads',
    icon: '👟',
    discount: 25,
    originalPrice: 4500,
    currentPrice: 3375
  },
  {
    id: '3',
    name: 'Pure Honey 500g',
    shop: "Mama's Pantry",
    icon: '🍯',
    discount: 15,
    originalPrice: 650,
    currentPrice: 552
  }
];

interface HotDealsProps {
  onDealClick?: (dealId: string) => void;
}

export const HotDeals = ({ onDealClick }: HotDealsProps) => {
  const [hoveredDeal, setHoveredDeal] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString()}`;
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-serif text-2xl font-normal">Hot Right Now</h2>
        <button 
          onClick={() => onDealClick?.('all')}
          className="text-xs text-gray-500 hover:text-gray-900 border-b border-gray-200 hover:border-gray-900 transition-colors"
        >
          See all deals →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hotDeals.map((deal) => (
          <div
            key={deal.id}
            onClick={() => onDealClick?.(deal.id)}
            onMouseEnter={() => setHoveredDeal(deal.id)}
            onMouseLeave={() => setHoveredDeal(null)}
            className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3.5 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-3xl flex-shrink-0">
              {deal.icon}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-medium text-sm mb-0.5">{deal.name}</h3>
              <p className="text-xs text-gray-400">{deal.shop}</p>
            </div>

            {/* Price & Discount */}
            <div className="text-right flex-shrink-0">
              <div className="text-lg font-bold text-green-700">{deal.discount}% OFF</div>
              <div className="text-xs text-gray-400 line-through">
                Was {formatPrice(deal.originalPrice)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};