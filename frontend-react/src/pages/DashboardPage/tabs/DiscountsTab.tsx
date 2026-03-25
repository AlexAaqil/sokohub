import { useState } from 'react';
import { Product } from '../../../api/products';
import { productAPI } from '../../../api/products';

interface DiscountsTabProps {
  products: Product[];
  onUpdate: () => void;
}

export const DiscountsTab = ({ products, onUpdate }: DiscountsTabProps) => {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [discountPercent, setDiscountPercent] = useState('');
  const [isOnOffer, setIsOnOffer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onOfferProducts = products.filter(p => p.is_on_offer || p.discount_pct > 0);

  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      setMessage('Please select a product');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await productAPI.update(selectedProduct, {
        discount_pct: parseInt(discountPercent) || 0,
        is_on_offer: isOnOffer,
      });
      setMessage('Discount applied successfully!');
      onUpdate();
      // Reset form
      setDiscountPercent('');
      setIsOnOffer(false);
      setSelectedProduct(null);
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Failed to apply discount');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Active Discounts Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-medium">Active Discounts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 text-xs text-gray-500">Product</th>
                <th className="text-left px-4 py-2 text-xs text-gray-500">Discount</th>
                <th className="text-left px-4 py-2 text-xs text-gray-500">Ends</th>
                <th className="text-left px-4 py-2 text-xs text-gray-500">Visible</th>
              </tr>
            </thead>
            <tbody>
              {onOfferProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    No active discounts
                  </td>
                </tr>
              ) : (
                onOfferProducts.map(product => (
                  <tr key={product.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 text-sm">{product.name}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                        {product.discount_pct}% OFF
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">Mar 20</td>
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={product.is_on_offer} className="sr-only peer" readOnly />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Discount Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-medium mb-4">Create Discount</h3>
        
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleApplyDiscount} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
            <select
              value={selectedProduct || ''}
              onChange={(e) => setSelectedProduct(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              required
            >
              <option value="">Select a product</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
            <input
              type="number"
              min="0"
              max="100"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              placeholder="e.g., 20"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isOnOffer}
                onChange={(e) => setIsOnOffer(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900"></div>
            </label>
            <span className="text-sm text-gray-700">Show on Deals page</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Applying...' : 'Apply Discount'}
          </button>
        </form>
      </div>
    </div>
  );
};