import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { shopAPI, Shop } from '../../../api/shops';

interface DeleteShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  shop: Shop | null;
}

export const DeleteShopModal = ({ isOpen, onClose, onSuccess, shop }: DeleteShopModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!shop) return;
    
    setLoading(true);
    setError('');

    try {
      await shopAPI.delete(shop.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete shop');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !shop) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-600">Delete Shop</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete <strong>{shop.name}</strong>?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone. All products in this shop will also be deleted.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Shop'}
          </button>
        </div>
      </div>
    </div>
  );
};