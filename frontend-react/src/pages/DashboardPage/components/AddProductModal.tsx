import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { productAPI } from '../../../api/products';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopId: number;
  onSuccess: () => void;
}

export const AddProductModal = ({ isOpen, onClose, shopId, onSuccess }: AddProductModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount_pct: '0',
    stock_qty: '0',
    category: '',
    is_on_offer: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Beauty & Wellness',
    'Fashion',
    'Electronics',
    'Food & Groceries',
    'Home & Living',
    'Art & Crafts',
    'Health',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await productAPI.create({
        shop_id: shopId,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discount_pct: parseInt(formData.discount_pct),
        is_on_offer: formData.is_on_offer,
        stock_qty: parseInt(formData.stock_qty),
        category: formData.category,
      });
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        discount_pct: '0',
        stock_qty: '0',
        category: '',
        is_on_offer: false,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add New Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="e.g., Aloe Vera Serum"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (KES) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.discount_pct}
              onChange={(e) => setFormData({ ...formData, discount_pct: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              value={formData.stock_qty}
              onChange={(e) => setFormData({ ...formData, stock_qty: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="Product description..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_on_offer"
              checked={formData.is_on_offer}
              onChange={(e) => setFormData({ ...formData, is_on_offer: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="is_on_offer" className="text-sm text-gray-700">
              Show as On Offer (appears in Deals page)
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};