import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import * as storageService from '../services/storageService';

const AdminDashboard = () => {
  const { products, categories } = useProducts();
  const orders = useMemo(() => storageService.getOrders(), []);

  // Compute statistics
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Confirmed').length;
    const lowStockCount = products.filter((p) => p.stock <= 10).length;

    return {
      totalProducts: products.length,
      totalCategories: categories.length,
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      lowStockCount,
    };
  }, [products, categories, orders]);

  // Recent 5 orders
  const recentOrders = useMemo(() => {
    return [...orders].slice(0, 5);
  }, [orders]);

  // Low stock products
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock <= 15).slice(0, 4);
  }, [products]);

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'text-[#064C32]',
      bg: 'bg-[#064C32]/10',
      change: '+14% this month',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'text-[#D9A514]',
      bg: 'bg-[#D9A514]/15',
      change: `${stats.pendingOrders} pending fulfillment`,
    },
    {
      title: 'Live Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-[#064C32]',
      bg: 'bg-[#064C32]/10',
      change: `${categories.length} active departments`,
    },
    {
      title: 'Low Stock Alert',
      value: stats.lowStockCount,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
      change: 'Needs replenishment',
    },
  ];

  return (
    <div className="space-y-8 bg-white">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#111111]">
            Executive Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Real-time overview of your BIYA FASHION catalog, orders, and sales inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#064C32] hover:bg-[#033B27] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-[#F3D477]" />
            <span>Add Product</span>
          </Link>
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E5E5E5] hover:bg-[#F8F8F8] text-xs font-semibold text-[#111111] transition"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </Link>
        </div>
      </div>

      {/* 4 Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#111111]">
                  {card.value}
                </p>
                <p className="text-[11px] text-[#666666] mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-[#064C32]" />
                  <span>{card.change}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Split: Recent Orders (8 cols) & Quick Inventory / Alerts (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#064C32]" />
              <h2 className="font-serif font-bold text-lg text-[#111111]">Recent Orders</h2>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-[#064C32] hover:text-[#033B27] uppercase tracking-wider flex items-center gap-1 hover:underline"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F8F8] text-[#111111] uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3 rounded-l-xl">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 font-mono font-bold text-[#064C32]">{ord.id}</td>
                    <td className="p-3">
                      <p className="font-semibold text-[#111111]">{ord.customer?.name}</p>
                      <p className="text-[10px] text-[#666666]">{ord.customer?.phone}</p>
                    </td>
                    <td className="p-3">{ord.items?.length || 0} pcs</td>
                    <td className="p-3 font-bold text-[#111111]">₹{ord.total?.toLocaleString('en-IN')}</td>
                    <td className="p-3">{ord.paymentMethod}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : ord.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock & Catalog Health (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Low Stock Notice */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif font-bold text-base text-[#111111]">Low Stock Alert</h3>
              </div>
              <Link
                to="/admin/products"
                className="text-[11px] font-bold text-[#064C32] hover:underline"
              >
                Manage
              </Link>
            </div>

            {lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=80'}
                        alt={p.name}
                        className="w-9 h-11 object-cover rounded-lg border border-[#E5E5E5]"
                      />
                      <div className="truncate max-w-[130px]">
                        <p className="font-semibold text-[#111111] truncate">{p.name}</p>
                        <p className="text-[10px] text-[#666666]">{p.category}</p>
                      </div>
                    </div>
                    <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                      {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#666666]">All products have sufficient stock levels.</p>
            )}
          </div>

          {/* Quick Department Links */}
          <div className="bg-[#F8F8F8] rounded-2xl border border-[#E5E5E5] p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              Quick Actions
            </h4>
            <div className="space-y-2">
              <Link
                to="/admin/products/add"
                className="block text-xs font-semibold text-[#064C32] hover:bg-white p-2.5 rounded-xl border border-transparent hover:border-[#E5E5E5] transition"
              >
                + Add New Fashion Product
              </Link>
              <Link
                to="/admin/categories"
                className="block text-xs font-semibold text-[#064C32] hover:bg-white p-2.5 rounded-xl border border-transparent hover:border-[#E5E5E5] transition"
              >
                + Create / Reorder Categories
              </Link>
              <Link
                to="/admin/settings"
                className="block text-xs font-semibold text-[#064C32] hover:bg-white p-2.5 rounded-xl border border-transparent hover:border-[#E5E5E5] transition"
              >
                ⚙ Update WhatsApp & Shipping Threshold
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
