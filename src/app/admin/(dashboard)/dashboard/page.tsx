import React from 'react';
import connectDB from 'src/lib/db';
import Product from 'src/models/Product';
import Order from 'src/models/Order';
import { Package, ShoppingCart, DollarSign, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Dynamic dashboard overview

async function getDashboardStats() {
  try {
    await connectDB();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    
    // Revenue calculations (excluding cancelled orders)
    const validOrders = await Order.find({ status: { $ne: 'cancelled' } }).select('total');
    const revenueSum = validOrders.reduce((sum, order) => sum + order.total, 0);

    // Low stock items (stock <= 3)
    const lowStockItems = await Product.find({ stock: { $lte: 3 } })
      .populate('category')
      .limit(6)
      .lean();

    return {
      stats: {
        totalProducts,
        totalOrders,
        pendingOrders,
        revenue: revenueSum,
      },
      lowStock: JSON.parse(JSON.stringify(lowStockItems)),
    };
  } catch (error) {
    console.error('Failed to get dashboard statistics', error);
    return {
      stats: { totalProducts: 0, totalOrders: 0, pendingOrders: 0, revenue: 0 },
      lowStock: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const { stats, lowStock } = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">Overview</h1>
        <p className="text-sm text-brand-text-secondary mt-1">Real-time statistics for Agha Tech plus Online Store</p>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="bg-brand-surface border border-border-default rounded-3xl p-6 flex justify-between items-start shadow-sm hover:bg-brand-elevated transition-colors">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-brand-text-tertiary uppercase tracking-wider">Total Products</span>
            <p className="text-brand-text-primary font-black text-3xl">{stats.totalProducts}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-accent-bright">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-brand-surface border border-border-default rounded-3xl p-6 flex justify-between items-start shadow-sm hover:bg-brand-elevated transition-colors">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-brand-text-tertiary uppercase tracking-wider">Total Orders</span>
            <p className="text-brand-text-primary font-black text-3xl">{stats.totalOrders}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-brand-surface border border-border-default rounded-3xl p-6 flex justify-between items-start shadow-sm hover:bg-brand-elevated transition-colors">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-brand-text-tertiary uppercase tracking-wider">Pending Orders</span>
            <p className="text-brand-text-primary font-black text-3xl">{stats.pendingOrders}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-brand-surface border border-border-default rounded-3xl p-6 flex justify-between items-start shadow-sm hover:bg-brand-elevated transition-colors">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-brand-text-tertiary uppercase tracking-wider">Total Revenue</span>
            <p className="text-brand-text-primary font-black text-3xl">${stats.revenue.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-brand-surface border border-border-default rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border-default flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-brand-text-primary">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold tracking-tight">Low Stock Inventory Alerts</h2>
          </div>
          <Link
            href="/admin/products"
            className="text-xs text-accent-bright hover:text-white font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Manage Inventory</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {lowStock.length === 0 ? (
          <div className="p-12 text-center text-brand-text-secondary text-sm">
            ✅ All products are fully stocked. No low-stock alerts.
          </div>
        ) : (
          <div className="divide-y divide-border-default">
            {lowStock.map((prod: any) => (
              <div key={prod._id} className="p-5 flex items-center justify-between gap-4 text-sm hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black/40 border border-border-default rounded-2xl flex items-center justify-center p-2 shrink-0">
                    <img src={prod.images?.[0] || '/images/placeholder.jpg'} alt={prod.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-brand-text-primary font-bold line-clamp-1">{prod.name}</h4>
                    <p className="text-brand-text-tertiary text-xs mt-0.5">{prod.brand} • {prod.category?.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-right shrink-0">
                  <span className="text-brand-text-secondary font-medium">${prod.price.toLocaleString()}</span>
                  <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-full text-xs font-mono">
                    {prod.stock} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
