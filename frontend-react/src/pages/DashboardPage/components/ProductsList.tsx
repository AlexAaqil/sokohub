import { Product } from '../../../api/products';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ProductsListProps {
  products: Product[];
  onDelete: (productId: number) => void;
  loading?: boolean;
}

export const ProductsList = ({ products, onDelete, loading }: ProductsListProps) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
        <div className="text-4xl mb-3">📦</div>
        <p className="text-gray-500">No products yet. Add your first product!</p>
      </div>
    );
  }

  const discountedPrice = (price: number, discount: number) => {
    return price * (1 - discount / 100);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Stock</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      '📦'
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category || 'Uncategorized'}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                {product.discount_pct > 0 ? (
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      KES {Math.round(discountedPrice(product.price, product.discount_pct)).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 line-through ml-2">
                      KES {product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-green-600 ml-2">{product.discount_pct}%</span>
                  </div>
                ) : (
                  <span className="text-sm">KES {product.price.toLocaleString()}</span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className={`text-sm ${product.stock_qty <= 5 ? 'text-orange-600' : 'text-gray-700'}`}>
                  {product.stock_qty} units
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                  product.stock_qty === 0 ? 'bg-red-50 text-red-600' :
                  product.is_on_offer ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {product.stock_qty === 0 ? 'Out of Stock' :
                   product.is_on_offer ? 'On Offer' : 'Active'}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};