import { Product } from '../../../api/products';

interface AnalyticsTabProps {
  products: Product[];
}

export const AnalyticsTab = ({ products }: AnalyticsTabProps) => {
  // Calculate top products by potential revenue (price × stock)
  const topProducts = [...products]
    .sort((a, b) => {
      const revenueA = (a.discount_pct > 0 ? a.price * (1 - a.discount_pct / 100) : a.price) * a.stock_qty;
      const revenueB = (b.discount_pct > 0 ? b.price * (1 - b.discount_pct / 100) : b.price) * b.stock_qty;
      return revenueB - revenueA;
    })
    .slice(0, 4);

  const totalInventoryValue = products.reduce((sum, p) => {
    const price = p.discount_pct > 0 
      ? p.price * (1 - p.discount_pct / 100) 
      : p.price;
    return sum + price * p.stock_qty;
  }, 0);

  const averagePrice = products.length > 0 
    ? products.reduce((sum, p) => sum + p.price, 0) / products.length 
    : 0;

  const conversionRate = 3.8;
  const returnRate = 1.2;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Conversion Rate</p>
          <p className="text-2xl font-bold">{conversionRate}%</p>
          <p className="text-xs text-green-600 mt-1">↑ 0.4% this week</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Avg. Order Value</p>
          <p className="text-2xl font-bold">KES 572</p>
          <p className="text-xs text-green-600 mt-1">↑ KES 48</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Return Rate</p>
          <p className="text-2xl font-bold">{returnRate}%</p>
          <p className="text-xs text-green-600 mt-1">↓ Improved</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Inventory Value</p>
          <p className="text-2xl font-bold">KES {totalInventoryValue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{products.length} products</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-medium mb-1">Revenue — Last 6 Months</h3>
        <div className="flex items-end gap-2 h-32 mt-6">
          {[48, 62, 55, 78, 70, 95].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className={`w-full rounded-t ${i === 5 ? 'bg-gray-900' : 'bg-gray-300'}`}
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-gray-400">
                {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-medium mb-4">Top Products by Revenue</h3>
        <div className="space-y-4">
          {topProducts.map((product, index) => {
            const revenue = (product.discount_pct > 0 
              ? product.price * (1 - product.discount_pct / 100) 
              : product.price) * product.stock_qty;
            const maxRevenue = topProducts[0] ? (product.discount_pct > 0 
              ? topProducts[0].price * (1 - topProducts[0].discount_pct / 100) 
              : topProducts[0].price) * topProducts[0].stock_qty : 1;
            const percentage = (revenue / maxRevenue) * 100;
            
            return (
              <div key={product.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{product.name}</span>
                  <span className="font-semibold">KES {Math.round(revenue).toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-900 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Stats */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-medium mb-3">Product Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Total Products</p>
            <p className="text-xl font-semibold">{products.length}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Average Price</p>
            <p className="text-xl font-semibold">KES {Math.round(averagePrice).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">On Offer</p>
            <p className="text-xl font-semibold">{products.filter(p => p.is_on_offer || p.discount_pct > 0).length}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Low Stock</p>
            <p className="text-xl font-semibold text-orange-600">{products.filter(p => p.stock_qty > 0 && p.stock_qty <= 5).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};