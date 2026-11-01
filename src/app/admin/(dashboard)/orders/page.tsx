'use client';

import React, { useState, useEffect } from 'react';
import {
  Eye, Clock, CheckCircle, Truck, XCircle, AlertCircle,
  Loader, ChevronDown, Phone, MapPin, CreditCard,
  MessageSquare, Printer, PackageCheck, Box
} from 'lucide-react';

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
  processing: <Box className="w-3.5 h-3.5 animate-pulse" />,
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

  const getWhatsAppCustomerUrl = (phone: string, name: string, orderId: string, total: number) => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) clean = '961' + clean.slice(1);
    else if (!clean.startsWith('961') && clean.length === 8) clean = '961' + clean;
    const msg = encodeURIComponent(
      `Hello ${name}! This is Agha Tech plus regarding your order #${orderId.slice(-6)} (Total: $${total.toLocaleString()}). We are preparing your order in our official Agha Tech plus packaging for doorstep delivery.`
    );
    return `https://wa.me/${clean}?text=${msg}`;
  };

  const handlePrintSlip = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">$${item.price.toLocaleString()}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">$${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Agha Tech plus - Packing Slip #${order._id.slice(-6)}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 30px; color: #1e293b; max-width: 800px; margin: auto; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284c7; padding-bottom: 15px; margin-bottom: 25px; }
          .brand { font-size: 26px; font-weight: 900; text-transform: uppercase; color: #0f172a; }
          .brand span { color: #0284c7; }
          .badge { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; font-size: 13px; line-height: 1.6; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 15px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
          th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }
          .total-box { margin-left: auto; width: 280px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 15px; font-size: 13px; }
          .total-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
          .final-total { border-top: 2px solid #0f172a; padding-top: 8px; font-weight: 900; font-size: 16px; color: #0f172a; }
          .seal-box { margin-top: 30px; border: 2px dashed #0284c7; background: #f0f9ff; padding: 15px; border-radius: 10px; text-align: center; font-size: 12px; color: #0369a1; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">Agha Tech <span>plus</span></div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Official Customer Order & Packaging Slip</div>
          </div>
          <div style="text-align: right;">
            <div class="badge">Official Sealed Package</div>
            <div style="font-family: monospace; font-size: 12px; margin-top: 5px; color: #64748b;">Order Ref: #${order._id}</div>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <strong style="color: #0f172a; display: block; margin-bottom: 5px;">Customer & Delivery Details:</strong>
            <div><strong>Recipient:</strong> ${order.customerDetails.name}</div>
            <div><strong>Phone:</strong> ${order.customerDetails.phone}</div>
            <div><strong>Destination:</strong> ${order.shippingAddress.streetAddress}, ${order.shippingAddress.city}, ${order.shippingAddress.region}</div>
            ${order.shippingAddress.details ? `<div><strong>Notes/Landmarks:</strong> ${order.shippingAddress.details}</div>` : ''}
          </div>
          <div class="card">
            <strong style="color: #0f172a; display: block; margin-bottom: 5px;">Payment & Delivery Mode:</strong>
            <div><strong>Payment Method:</strong> CASH ON DELIVERY (USD)</div>
            <div><strong>Package Status:</strong> Sourced & Packaged under Agha Tech plus</div>
            <div><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="total-box">
          <div class="total-row"><span>Items Subtotal:</span><span>$${order.subtotal.toLocaleString()}</span></div>
          <div class="total-row"><span>Nationwide Delivery:</span><span>$${order.deliveryFee.toLocaleString()}</span></div>
          <div class="total-row final-total"><span>Amount to Pay (COD):</span><span>$${order.total.toLocaleString()} USD</span></div>
        </div>

        <div class="seal-box">
          <strong>Agha Tech plus Quality Guarantee</strong><br/>
          This product was inspected, sealed, and packaged under official Agha Tech plus supervision.<br/>
          For customer support or warranty verification: WhatsApp +961 76 743 718
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-border-default pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Order Management</h1>
          <p className="text-sm text-brand-text-secondary mt-1">
            Track customer orders, contact clients via WhatsApp, and prepare Agha Tech plus packaging slips
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-brand-surface border border-border-default px-3 py-1.5 rounded-xl text-brand-text-secondary font-mono">
            {orders.length} total orders
          </span>
        </div>
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
                          <div className="inline-flex items-center gap-2">
                            <a
                              href={getWhatsAppCustomerUrl(order.customerDetails.phone, order.customerDetails.name, order._id, order.total)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 transition-colors"
                              title="Chat with Customer on WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>

                            <button
                              onClick={() => handlePrintSlip(order)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-border-default transition-colors"
                              title="Print Agha Tech plus Packing Slip"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

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
                                  <option value="processing">Sourcing & Packaging</option>
                                  <option value="delivered">Out for Delivery</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              )}
                            </div>
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

                                <div className="pt-2 flex flex-wrap gap-2">
                                  <a
                                    href={getWhatsAppCustomerUrl(order.customerDetails.phone, order.customerDetails.name, order._id, order.total)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-semibold"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>WhatsApp Customer</span>
                                  </a>
                                  <button
                                    onClick={() => handlePrintSlip(order)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-border-default text-xs font-semibold"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>Print Agha Tech plus Slip</span>
                                  </button>
                                </div>
                              </div>

                              {/* Middle details - Fulfillment checklist */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-1.5 text-white font-bold border-b border-slate-850 pb-2">
                                  <PackageCheck className="w-4 h-4 text-accent-bright" />
                                  <span>Fulfillment & Packaging Workflow</span>
                                </div>
                                <div className="space-y-2.5 text-xs text-slate-350">
                                  <div className="p-3 rounded-xl bg-white/5 border border-border-default space-y-1.5">
                                    <p className="text-white font-semibold flex items-center gap-1.5">
                                      <Box className="w-3.5 h-3.5 text-accent-bright" />
                                      <span>Agha Tech plus Packaging Process:</span>
                                    </p>
                                    <p className="text-[11px] text-brand-text-secondary leading-relaxed">
                                      1. Source ordered items from authorized distributors.<br/>
                                      2. Inspect factory seals and verify serial numbers.<br/>
                                      3. Enclose into official Agha Tech plus tamper-proof branded packaging.<br/>
                                      4. Dispatch for doorstep Cash on Delivery (COD).
                                    </p>
                                  </div>

                                  <div className="space-y-1 text-slate-350">
                                    <p><span className="text-brand-text-tertiary font-medium">Payment Mode:</span> <span className="uppercase font-semibold text-white">{order.paymentMethod}</span> (Cash on Delivery)</p>
                                    {order.paymentDetails?.notes && (
                                      <p><span className="text-brand-text-tertiary font-medium">Sender Notes:</span> {order.paymentDetails.notes}</p>
                                    )}
                                  </div>
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
                                      <span>Total to Collect</span>
                                      <span className="font-mono text-emerald-400">${order.total.toLocaleString()} USD</span>
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
