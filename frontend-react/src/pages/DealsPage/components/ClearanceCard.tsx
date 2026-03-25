import { useNavigate } from 'react-router-dom';
import { ProductWithShop } from '../../../api/products';

interface ClearanceCardProps {
  product: ProductWithShop;
}

export const ClearanceCard = ({ product }: ClearanceCardProps) => {
  const navigate = useNavigate();
  
  const discountedPrice = product.price * (1 - product.discount_pct / 100);

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="h-32 bg-gray-100 flex items-center justify-center text-4xl">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          product.category === 'Beauty' ? '🧴' :
          product.category === 'Fashion' ? '🧦' :
          product.category === 'Electronics' ? '🔌' :
          product.category === 'Food' ? '🌸' :
          '🏷️'
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{product.shop_name}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-semibold text-sm">
            KES {Math.round(discountedPrice).toLocaleString()}
          </span>
          <span className="text-xs text-gray-400 line-through">
            KES {product.price.toLocaleString()}
          </span>
          <span className="text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
            {product.discount_pct}% OFF
          </span>
        </div>
      </div>
    </div>
  );
};