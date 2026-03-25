import { useNavigate } from 'react-router-dom';
import { ProductWithShop } from '../../../api/products';

interface DealCardProps {
  product: ProductWithShop;
}

export const DealCard = ({ product }: DealCardProps) => {
  const navigate = useNavigate();
  
  const discountedPrice = product.price * (1 - product.discount_pct / 100);
  const savings = product.price - discountedPrice;

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Product Icon/Image */}
      <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-xl" />
        ) : (
          product.category === 'Beauty' ? '🧴' :
          product.category === 'Fashion' ? '👗' :
          product.category === 'Electronics' ? '📱' :
          product.category === 'Food' ? '🍯' :
          '📦'
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{product.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {product.shop_name} · {product.category}
        </p>
      </div>

      {/* Price Info */}
      <div className="text-right">
        <div className="text-lg font-bold text-green-600">
          {product.discount_pct}% OFF
        </div>
        <div className="text-sm text-gray-500 line-through">
          KES {product.price.toLocaleString()}
        </div>
        <div className="text-sm font-semibold text-gray-900">
          KES {Math.round(discountedPrice).toLocaleString()}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Save KES {Math.round(savings).toLocaleString()}
        </div>
      </div>
    </div>
  );
};