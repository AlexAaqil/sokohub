import { Shop } from '../../../api/shops';

interface ShopSelectorProps {
  shops: Shop[];
  selectedShopId: number | null;
  onSelectShop: (shopId: number) => void;
}

export const ShopSelector = ({ shops, selectedShopId, onSelectShop }: ShopSelectorProps) => {
  if (shops.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Shop
      </label>
      <div className="flex gap-3 flex-wrap">
        {shops.map(shop => (
          <button
            key={shop.id}
            onClick={() => onSelectShop(shop.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedShopId === shop.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {shop.name}
          </button>
        ))}
      </div>
    </div>
  );
};