import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { shopAPI, Shop } from '../../api/shops';
import { productAPI, Product } from '../../api/products';
import { ShopSelector } from './components/ShopSelector';
import { AddProductModal } from './components/AddProductModal';
import { ProductsList } from './components/ProductsList';
import { CreateShopModal } from './components/CreateShopModal';
import { EditShopModal } from './components/EditShopModal';
import { DeleteShopModal } from './components/DeleteShopModal';
import { OverviewTab } from './tabs/OverviewTab';
import { InventoryTab } from './tabs/InventoryTab';
import { DiscountsTab } from './tabs/DiscountsTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

type TabType = 'overview' | 'products' | 'inventory' | 'discounts' | 'analytics';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCreateShopModal, setShowCreateShopModal] = useState(false);
  const [showEditShopModal, setShowEditShopModal] = useState(false);
  const [showDeleteShopModal, setShowDeleteShopModal] = useState(false);
  const [shopToEdit, setShopToEdit] = useState<Shop | null>(null);
  const [shopToDelete, setShopToDelete] = useState<Shop | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    fetchMyShops();
  }, []);

  useEffect(() => {
    if (selectedShopId) {
      fetchProducts(selectedShopId);
    }
  }, [selectedShopId]);

  const fetchMyShops = async () => {
    try {
      const data = await shopAPI.getMyShops();
      setShops(data);
      if (data.length > 0) {
        setSelectedShopId(data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (shopId: number) => {
    try {
      const data = await productAPI.getByShop(shopId);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productAPI.delete(productId);
      if (selectedShopId) {
        fetchProducts(selectedShopId);
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: 'Products' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'discounts', label: 'Discounts' },
    { id: 'analytics', label: 'Analytics' },
  ] as const;

  if (user?.role !== 'seller') {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Seller Access Required</h1>
          <p className="text-gray-600 mb-6">
            You need to be a seller to access the dashboard.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  const currentShop = shops.find(s => s.id === selectedShopId) || null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header with Shop Management */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Shop Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, {user?.full_name}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateShopModal(true)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            New Shop
          </button>
          {currentShop && (
            <>
              <button
                onClick={() => {
                  setShopToEdit(currentShop);
                  setShowEditShopModal(true);
                }}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <PencilIcon className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => {
                  setShopToDelete(currentShop);
                  setShowDeleteShopModal(true);
                }}
                className="p-2 border border-gray-200 rounded-lg hover:bg-red-50"
              >
                <TrashIcon className="w-4 h-4 text-red-500" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Shop Selector */}
      {shops.length > 0 && (
        <ShopSelector
          shops={shops}
          selectedShopId={selectedShopId}
          onSelectShop={setSelectedShopId}
        />
      )}

      {/* Shop Actions Bar */}
      {currentShop && activeTab === 'products' && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
          >
            + Add Product
          </button>
        </div>
      )}

      {/* No Shops State */}
      {shops.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center mt-6">
          <div className="text-6xl mb-4">🏪</div>
          <h2 className="text-xl font-semibold mb-2">No shops yet</h2>
          <p className="text-gray-500 mb-6">
            Create your first shop to start selling products.
          </p>
          <button
            onClick={() => setShowCreateShopModal(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Create a Shop
          </button>
        </div>
      )}

      {/* Tabs - Only show if shops exist */}
      {shops.length > 0 && (
        <>
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-gray-900 border-b-2 border-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'overview' && currentShop && (
              <OverviewTab shop={currentShop} products={products} />
            )}
            
            {activeTab === 'products' && selectedShopId && (
              <ProductsList
                products={products}
                onDelete={handleDeleteProduct}
              />
            )}
            
            {activeTab === 'inventory' && selectedShopId && (
              <InventoryTab products={products} />
            )}
            
            {activeTab === 'discounts' && selectedShopId && (
              <DiscountsTab 
                products={products} 
                onUpdate={() => selectedShopId && fetchProducts(selectedShopId)} 
              />
            )}
            
            {activeTab === 'analytics' && selectedShopId && (
              <AnalyticsTab products={products} />
            )}
          </div>
        </>
      )}

      {/* Modals */}
      <CreateShopModal
        isOpen={showCreateShopModal}
        onClose={() => setShowCreateShopModal(false)}
        onSuccess={fetchMyShops}
      />
      
      <EditShopModal
        isOpen={showEditShopModal}
        onClose={() => setShowEditShopModal(false)}
        onSuccess={fetchMyShops}
        shop={shopToEdit}
      />
      
      <DeleteShopModal
        isOpen={showDeleteShopModal}
        onClose={() => setShowDeleteShopModal(false)}
        onSuccess={fetchMyShops}
        shop={shopToDelete}
      />
      
      {selectedShopId && (
        <AddProductModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          shopId={selectedShopId}
          onSuccess={() => fetchProducts(selectedShopId)}
        />
      )}
    </div>
  );
};