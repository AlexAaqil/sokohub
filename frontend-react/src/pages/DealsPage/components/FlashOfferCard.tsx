import { useNavigate } from 'react-router-dom';
import { ProductWithShop } from '../../../api/products';

interface FlashOfferCardProps {
  product: ProductWithShop;
}

export const FlashOfferCard = ({ product }: FlashOfferCardProps) => {
  const navigate = useNavigate();
  
  const discountedPrice = product.price * (1 - product.discount_pct / 100);
  const savings = product.price - discountedPrice;

  const getIcon = () => {
    const icons: Record<string, string> = {
      'Beauty': '🧴',
      'Fashion': '👗',
      'Electronics': '📱',
      'Food': '🍯',
      'Home': '🪴',
      'Skincare': '🧴',
      'Wellness': '🌿'
    };
    return icons[product.category] || '🏷️';
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Icon/Image */}
      <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-xl" />
        ) : (
          getIcon()
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{product.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {product.shop_name} · {product.category}
        </p>
        
      </div>

      {/* Discount Badge */}
      <div className="text-right">
        <div className="text-xl font-bold text-green-600">
          {product.discount_pct}% OFF
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-gray-900">
            KES {Math.round(discountedPrice).toLocaleString()}
          </span>
          <span className="text-xs text-gray-400 line-through">
            KES {product.price.toLocaleString()}
          </span>
          <span className="text-xs text-green-600">
            {Math.round(savings).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};