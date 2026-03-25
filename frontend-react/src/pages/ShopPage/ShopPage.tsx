import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shopAPI, Shop } from '../../api/shops';
import { productAPI, Product } from '../../api/products';

export const ShopPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'offers' | 'about' | 'reviews'>('products');

  useEffect(() => {
    const fetchShopData = async () => {
      if (!id) return;
      try {
        const shopData = await shopAPI.getById(parseInt(id));
        setShop(shopData);
        
        const productsData = await productAPI.getByShop(parseInt(id));
        setProducts(productsData);
      } catch (error) {
        console.error('Failed to fetch shop:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-100 rounded-xl mb-6" />
          <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Shop Not Found</h2>
        <p className="text-gray-500 mb-6">The shop you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Filter products based on active tab
  const displayedProducts = activeTab === 'offers' 
    ? products.filter(p => p.is_on_offer || p.discount_pct > 0)
    : products;

  return (
    <div className="pages_container">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
      >
        ← Back to Discover
      </button>

      {/* Shop Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="flex gap-5">
          {/* Shop Logo */}
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
            {shop.logo_url ? (
              <img src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              '🏪'
            )}
          </div>
          
          <div className="flex-1">
            <div className="grid gap-2">
                <h1 className="text-2xl font-serif font-semibold">{shop.name}</h1>

                <div>
                    <span className={`text-xs px-2 py-1 rounded-full ${shop.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {shop.is_active ? 'Open Now' : 'Closed'}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        {shop.category || 'General'}
                    </span>
                </div>

                <p className="text-sm text-gray500 max-2-xl">{shop.description || 'No description provided.'}</p>
            </div>
          </div>
        </div>

        {/* Shop Stats Row */}
        <div className="flex gap-8 mt-6 pt-5 border-t border-gray-100">
          <div className="text-center">
            <div className="text-xl font-semibold">{products.length}</div>
            <div className="text-xs text-gray-400">Products</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold">4.9★</div>
            <div className="text-xs text-gray-400">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold">312</div>
            <div className="text-xs text-gray-400">Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold">2.1k</div>
            <div className="text-xs text-gray-400">Sales</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {[
          { id: 'products', label: 'All Products' },
          { id: 'offers', label: 'On Offer' },
          { id: 'about', label: 'About' },
          { id: 'reviews', label: 'Reviews' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
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

      {/* Products Grid */}
      {activeTab === 'products' || activeTab === 'offers' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayedProducts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No products found{activeTab === 'offers' ? ' with active offers' : ''}.
            </div>
          ) : (
            displayedProducts.map(product => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="h-32 bg-gray-100 flex items-center justify-center text-4xl">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    '📦'
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm text-gray-900">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {product.discount_pct > 0 ? (
                      <>
                        <span className="font-semibold text-sm">
                          KES {Math.round(product.price * (1 - product.discount_pct / 100))}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          KES {product.price}
                        </span>
                        <span className="text-xs text-green-600">{product.discount_pct}%</span>
                      </>
                    ) : (
                      <span className="font-semibold text-sm">KES {product.price}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'about' ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold mb-3">About {shop.name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {shop.description || "This shop hasn't added a description yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">
          Reviews coming soon...
        </div>
      )}
    </div>
  );
};