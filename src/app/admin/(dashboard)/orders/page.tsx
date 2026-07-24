'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Clock, CheckCircle, Truck, XCircle, AlertCircle, Loader, ChevronDown, Phone, MapPin, CreditCard } from 'lucide-react';

interface OrderItem {
  _id: string;
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  _id: string;
  customerDetails: {
    name: string;
    phone: string;
    email: string;
  };
  shippingAddress: {
    city: string;
    region: string;
    streetAddress: string;
    details?: string;
  };
  paymentMethod: 'cod' | 'whish_omt' | 'bank_transfer';
  paymentDetails?: {
    referenceCode?: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-955/20 text-amber-400 border-amber-900/30',
  confirmed: 'bg-blue-955/20 text-blue-400 border-blue-900/30',
  processing: 'bg-indigo-955/20 text-accent-bright border-indigo-900/30',
  delivered: 'bg-emerald-955/20 text-emerald-400 border-emerald-900/30',
  cancelled: 'bg-red-955/20 text-red-400 border-red-900/30',
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-3.5 h-3.5" />,
  confirmed: <CheckCircle className="w-3.5 h-3.5" />,
  processing: <Loader className="w-3.5 h-3.5 animate-spin" />,
  delivered: <CheckCircle className="w-3.5 h-3.5" />,
  cancelled: <XCircle className="w-3.5 h-3.5" />,
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(orders.map((o) => (o._id === id ? { ...o, status: data.order.status } : o)));
      }
    } catch (e) {
      console.error('Failed to update order status', e);
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-border-default pb-5">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Order Management</h1>
        <p className="text-sm text-brand-text-secondary mt-1">Review orders, verify local money transfers, and process shipments</p>
      </div>

      {/* Orders Table list */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-brand-surface/35 border border-dashed border-border-default rounded-2xl">
          <p className="text-brand-text-secondary text-sm">No orders found.</p>
        </div>
      ) : (
        <div className="bg-brand-surface border border-border-default rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-brand-deep border-b border-slate-850 text-brand-text-secondary font-bold uppercase tracking-wider">
                  <th className="p-4 w-6"></th>
                  <th className="p-4">Reference ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date Placed</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4 text-center">Total Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {orders.map((order) => {
                  const isExpanded = expandedOrderId === order._id;
                  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <React.Fragment key={order._id}>
                      <tr
                        className={`hover:bg-slate-955/20 transition-all text-slate-200 cursor-pointer ${
                          isExpanded ? 'bg-brand-deep/20' : ''
                        }`}
                        onClick={() => toggleExpand(order._id)}
                      >
                        <td className="p-4 text-center">
                          <ChevronDown className={`w-4 h-4 text-brand-text-tertiary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </td>
                        <td className="p-4 font-mono font-bold text-white shrink-0 truncate max-w-[120px]">{order._id}</td>
                        <td className="p-4">
                          <p className="font-semibold text-white">{order.customerDetails.name}</p>
                          <p className="text-[10px] text-brand-text-tertiary mt-0.5">{order.customerDetails.phone}</p>
                        </td>
                        <td className="p-4 text-brand-text-secondary">{date}</td>
                        <td className="p-4 font-semibold uppercase">{order.paymentMethod}</td>
                        <td className="p-4 text-center font-mono font-semibold">${order.total.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border ${statusColors[order.status]}`}>
                            {statusIcons[order.status]}
                            <span>{order.status}</span>
                          </span>
                        </td>
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-block relative">
                            {updatingId === order._id ? (
                              <Loader className="w-4 h-4 text-indigo-500 animate-spin mr-3" />
                            ) : (
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                className="bg-brand-deep border border-slate-850 text-white rounded-lg p-1.5 text-[11px] outline-none font-semibold"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={8} className="p-0 bg-brand-deep/45">
                            <div className="p-6 border-b border-border-default grid grid-cols-1 md:grid-cols-3 gap-8 text-xs sm:text-sm animate-fade-in">
                              
                              {/* Left details - Address */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-1.5 text-white font-bold border-b border-slate-850 pb-2">
                                  <MapPin className="w-4 h-4 text-accent-bright" />
                                  <span>Delivery Destination</span>
                                </div>
                                <div className="space-y-2 text-slate-350">
                                  <p><span className="text-brand-text-tertiary font-medium">City:</span> {order.shippingAddress.city}</p>
                                  <p><span className="text-brand-text-tertiary font-medium">Region:</span> {order.shippingAddress.region}</p>
                                  <p><span className="text-brand-text-tertiary font-medium">Address:</span> {order.shippingAddress.streetAddress}</p>
                                  {order.shippingAddress.details && (
                                    <p><span className="text-brand-text-tertiary font-medium">Landmarks:</span> {order.shippingAddress.details}</p>
                                  )}
                                </div>
                              </div>

                              {/* Middle details - Payment reference */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-1.5 text-white font-bold border-b border-slate-850 pb-2">
                                  <CreditCard className="w-4 h-4 text-accent-bright" />
                                  <span>Payment details</span>
                                </div>
                                <div className="space-y-2 text-slate-350">
                                  <p><span className="text-brand-text-tertiary font-medium">Payment Mode:</span> <span className="uppercase">{order.paymentMethod}</span></p>
                                  {order.paymentDetails?.referenceCode && (
                                    <p><span className="text-brand-text-tertiary font-medium">Ref. Code:</span> <span className="font-mono text-accent-bright font-bold bg-brand-surface border border-slate-850 px-2 py-0.5 rounded">{order.paymentDetails.referenceCode}</span></p>
                                  )}
                                  {order.paymentDetails?.notes && (
                                    <p><span className="text-brand-text-tertiary font-medium">Sender Notes:</span> {order.paymentDetails.notes}</p>
                                  )}
                                </div>
                              </div>

                              {/* Right details - Checkout items table */}
                              <div className="space-y-4 md:col-span-1">
                                <div className="flex items-center gap-1.5 text-white font-bold border-b border-slate-850 pb-2">
                                  <Eye className="w-4 h-4 text-accent-bright" />
                                  <span>Order Items</span>
                                </div>
                                <div className="border border-slate-850 rounded-xl overflow-hidden bg-brand-deep divide-y divide-slate-900">
                                  {order.items.map((item) => (
                                    <div key={item._id} className="p-3 flex justify-between items-center text-xs">
                                      <div>
                                        <p className="text-white font-semibold line-clamp-1">{item.name}</p>
                                        <p className="text-brand-text-tertiary mt-0.5">Qty: {item.quantity} • ${item.price.toLocaleString()}</p>
                                      </div>
                                      <span className="text-accent-bright font-semibold font-mono">${(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                  ))}
                                  
                                  <div className="p-3 bg-brand-surface/40 text-brand-text-secondary space-y-1.5">
                                    <div className="flex justify-between">
                                      <span>Subtotal</span>
                                      <span className="font-mono text-white">${order.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Delivery Fee</span>
                                      <span className="font-mono text-white">${order.deliveryFee.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-white font-bold border-t border-border-default pt-1.5 text-sm">
                                      <span>Total</span>
                                      <span className="font-mono text-accent-bright">${order.total.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
