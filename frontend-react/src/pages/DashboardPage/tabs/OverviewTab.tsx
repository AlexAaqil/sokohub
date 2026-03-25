import { Shop } from '../../../api/shops';
import { Product } from '../../../api/products';

interface OverviewTabProps {
  shop: Shop;
  products: Product[];
}

export const OverviewTab = ({ shop, products }: OverviewTabProps) => {
  const totalRevenue = products.reduce((sum, p) => {
    const price = p.discount_pct > 0 
      ? p.price * (1 - p.discount_pct / 100) 
      : p.price;
    return sum + price * p.stock_qty;
  }, 0);

  const lowStockItems = products.filter(p => p.stock_qty > 0 && p.stock_qty <= 5);
  const outOfStockItems = products.filter(p => p.stock_qty === 0);
  const onOfferItems = products.filter(p => p.is_on_offer || p.discount_pct > 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Revenue</p>
          <p className="text-2xl font-bold">KES {totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1">↑ 18% vs last month</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Orders</p>
          <p className="text-2xl font-bold">147</p>
          <p className="text-xs text-green-600 mt-1">↑ 9 new today</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Products</p>
          <p className="text-2xl font-bold">{products.length}</p>
          <p className="text-xs text-orange-600 mt-1">↓ {lowStockItems.length + outOfStockItems.length} low stock</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Shop Views</p>
          <p className="text-2xl font-bold">3,812</p>
          <p className="text-xs text-green-600 mt-1">↑ 22% this week</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium">Recent Orders</h3>
            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">5 pending</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 text-xs text-gray-500">Order</th>
                  <th className="text-left px-4 py-2 text-xs text-gray-500">Product</th>
                  <th className="text-left px-4 py-2 text-xs text-gray-500">Amount</th>
                  <th className="text-left px-4 py-2 text-xs text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-2 text-sm">#1041</td>
                  <td className="px-4 py-2 text-sm">Aloe Vera Serum</td>
                  <td className="px-4 py-2 text-sm">KES 720</td>
                  <td className="px-4 py-2"><span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">Paid</span></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-2 text-sm">#1040</td>
                  <td className="px-4 py-2 text-sm">Rosehip Face Oil</td>
                  <td className="px-4 py-2 text-sm">KES 1,850</td>
                  <td className="px-4 py-2"><span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full">Pending</span></td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">#1039</td>
                  <td className="px-4 py-2 text-sm">Shea Butter Soap ×3</td>
                  <td className="px-4 py-2 text-sm">KES 960</td>
                  <td className="px-4 py-2"><span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">Paid</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-medium mb-1">Sales This Week</h3>
          <p className="text-xs text-gray-500 mb-4">KES 18,400 total</p>
          <div className="flex items-end gap-2 h-32">
            {[35, 55, 40, 70, 60, 90, 75].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className={`w-full rounded-t ${i >= 5 ? 'bg-gray-900' : 'bg-gray-300'}`}
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-400">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shop Info */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-medium mb-2">Shop Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Shop Name</p>
            <p className="font-medium">{shop.name}</p>
          </div>
          <div>
            <p className="text-gray-500">Category</p>
            <p className="font-medium">{shop.category || 'Not specified'}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-gray-500">Description</p>
            <p className="text-gray-700">{shop.description || 'No description'}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <span className={`inline-flex px-2 py-1 rounded-full text-xs ${shop.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
              {shop.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div>
            <p className="text-gray-500">Products</p>
            <p className="font-medium">{products.length} total</p>
          </div>
        </div>
      </div>
    </div>
  );
};