import { Product } from '../../../api/products';

interface InventoryTabProps {
  products: Product[];
}

export const InventoryTab = ({ products }: InventoryTabProps) => {
  const lowStockItems = products.filter(p => p.stock_qty > 0 && p.stock_qty <= 5);
  const outOfStockItems = products.filter(p => p.stock_qty === 0);
  const healthyStockItems = products.filter(p => p.stock_qty > 5);

  const getStockPercentage = (stock: number) => {
    const maxStock = Math.max(...products.map(p => p.stock_qty), 100);
    return Math.min((stock / maxStock) * 100, 100);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Stock Levels Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-medium mb-1">Stock Levels</h3>
        <p className="text-xs text-gray-500 mb-4">{lowStockItems.length + outOfStockItems.length} items need attention</p>
        
        <div className="space-y-4">
          {products.map(product => (
            <div key={product.id} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  '📦'
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">{product.name}</span>
                  <span className={`text-xs ${product.stock_qty <= 5 ? 'text-orange-600' : 'text-gray-500'}`}>
                    {product.stock_qty} units
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${product.stock_qty <= 5 ? 'bg-orange-500' : 'bg-green-500'}`}
                    style={{ width: `${getStockPercentage(product.stock_qty)}%` }}
                  />
                </div>
                {product.stock_qty <= 5 && product.stock_qty > 0 && (
                  <p className="text-xs text-orange-600 mt-1">⚠️ Low stock - reorder soon</p>
                )}
                {product.stock_qty === 0 && (
                  <p className="text-xs text-red-600 mt-1">❌ Out of stock</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update Stock Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-medium mb-4">Update Stock</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400">
              <option value="">Search product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Add Units</label>
            <input 
              type="number" 
              placeholder="0" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Restock Alert Threshold</label>
            <input 
              type="number" 
              placeholder="10" 
              defaultValue="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <button className="w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800">
            Update Inventory
          </button>
        </div>
      </div>
    </div>
  );
};