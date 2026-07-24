'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from 'src/lib/context/CartContext';
import { useAuth } from 'src/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { CreditCard, CheckCircle, MessageSquare, ShoppingBag, Loader, Phone, MapPin, Truck } from 'lucide-react';
import Link from 'next/link';

const LEBANESE_CITIES = [
  'Beirut', 'Tripoli', 'Sidon', 'Tyre', 'Nabatieh', 
  'Jounieh', 'Byblos (Jbeil)', 'Zahle', 'Baalbek', 
  'Aley', 'Choueifat', 'Bchamoun', 'Aramoun'
];

interface Settings {
  storeName: string;
  contactPhone: string;
  whatsAppNumber: string;
  deliveryFee: number;
}

export default function CheckoutPage() {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [settings, setSettings] = useState<Settings | null>(null);
  const [deliveryFee, setDeliveryFee] = useState(5);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [details, setDetails] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
          setDeliveryFee(data.settings.deliveryFee);
        }
      })
      .catch((err) => console.error('Failed to fetch settings', err));
  }, []);

  useEffect(() => {
    if (cartItems.length === 0 && !placedOrder) {
      router.push('/cart');
    }
  }, [cartItems, placedOrder, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !phone || !email || !city || !region || !streetAddress) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      customerDetails: { name, phone, email },
      shippingAddress: { city, region, streetAddress, details },
      paymentMethod: 'cod',
      paymentDetails: { notes },
      items: cartItems,
      subtotal: cartSubtotal,
      deliveryFee,
      total: cartSubtotal + deliveryFee,
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPlacedOrder(data.order);
        clearCart();
      } else {
        setError(data.error || 'Checkout failed. Please try again.');
      }
    } catch {
      setError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppConfirm = () => {
    if (!placedOrder) return;
    const text = encodeURIComponent(
      `Hello Cedar Tech!\nI just placed an order on your website.\n\nOrder ID: ${placedOrder.id}\nPayment: CASH ON DELIVERY\nTotal: $${(cartSubtotal + deliveryFee).toLocaleString()}\n\nDelivery to:\n${name}\n${phone}\n${city}, ${region}\n${streetAddress}`
    );
    const waNumber = settings?.whatsAppNumber || '96179115521';
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
  };

  /* Render Order Placed Confirmation */
  if (placedOrder) {
    return (
      <div className="w-full max-w-2xl mx-auto py-16 px-6 text-center space-y-8 my-8">
        <div
          className="p-10 rounded-3xl space-y-6 bg-brand-surface border border-green-500/30 shadow-2xl"
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto text-green-500 bg-green-500/10 border border-green-500/30">
            <CheckCircle className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-brand-text-primary tracking-tight">Order Placed Successfully!</h1>
            <p className="text-sm text-brand-text-secondary">
              Thank you for shopping with Cedar Tech. Your order has been registered in our system.
            </p>
          </div>

          <div className="p-5 rounded-2xl text-left space-y-3 font-mono text-xs sm:text-sm bg-brand-surface border border-border-default">
            <div className="flex justify-between pb-2 border-b border-border-default">
              <span style={{ color: '#86868b' }}>Order ID</span>
              <span className="text-white font-bold">{placedOrder.id}</span>
            </div>
            <div className="flex justify-between pb-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <span style={{ color: '#86868b' }}>Payment Method</span>
              <span className="text-white font-semibold uppercase">Cash on Delivery (USD)</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#86868b' }}>Total Payable</span>
              <span className="text-[#30d158] font-extrabold">${placedOrder.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <p className="text-xs max-w-md mx-auto leading-relaxed" style={{ color: '#86868b' }}>
              IMPORTANT: To expedite delivery and receive dispatch updates, please tap below to share your order receipt with our team on WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleWhatsAppConfirm}
                className="btn-primary text-sm font-bold justify-center py-3.5 px-6 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Confirm via WhatsApp</span>
              </button>

              <Link
                href="/products"
                className="btn-ghost text-sm font-semibold justify-center py-3.5 px-6 rounded-full"
              >
                Back to Store
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* Render Checkout Form */
  return (
    <div className="w-full max-w-[1160px] mx-auto px-6 py-12 space-y-8">
      <div className="border-b pb-6 border-border-default">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text-primary tracking-tight">Checkout</h1>
        <p className="text-sm mt-1 text-brand-text-secondary">Complete your delivery &amp; payment details</p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl text-sm" style={{ background: 'rgba(244,63,94,0.12)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.25)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Customer Info Card */}
          <div className="rounded-3xl p-6 space-y-4 bg-brand-surface border border-border-default">
            <div className="flex items-center gap-2 text-brand-text-primary border-b pb-3 border-border-default">
              <Phone className="w-4.5 h-4.5 text-accent-blue" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Customer Contact</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-brand-text-primary rounded-xl p-3 outline-none text-sm bg-white/5 border border-border-default focus:border-accent-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +961 70 123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-brand-text-primary rounded-xl p-3 outline-none text-sm bg-white/5 border border-border-default focus:border-accent-blue"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-brand-text-primary rounded-xl p-3 outline-none text-sm bg-white/5 border border-border-default focus:border-accent-blue"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="rounded-3xl p-6 space-y-4 bg-brand-surface border border-border-default">
            <div className="flex items-center gap-2 text-brand-text-primary border-b pb-3 border-border-default">
              <MapPin className="w-4.5 h-4.5 text-accent-blue" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Delivery Address (Lebanon)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1.5">
                  City
                </label>
                <select
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-brand-text-primary rounded-xl p-3 outline-none text-sm bg-white/5 border border-border-default focus:border-accent-blue"
                >
                  <option value="" className="bg-brand-surface text-brand-text-primary">Select City</option>
                  {LEBANESE_CITIES.map((c) => (
                    <option key={c} value={c} className="bg-brand-surface text-brand-text-primary">{c}</option>
                  ))}
                  <option value="other" className="bg-brand-surface text-brand-text-primary">Other Location</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1.5">
                  Governorate / Region
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mount Lebanon, South, Bekaa"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full text-brand-text-primary rounded-xl p-3 outline-none text-sm bg-white/5 border border-border-default focus:border-accent-blue"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1.5">
                  Street Address &amp; Building
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hamra Street, Al-Amir Building, 4th Floor"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full text-brand-text-primary rounded-xl p-3 outline-none text-sm bg-white/5 border border-border-default focus:border-accent-blue"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1.5">
                  Delivery Details / Landmarks (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near ABC Mall, next to the pharmacy"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full text-brand-text-primary rounded-xl p-3 outline-none text-sm bg-white/5 border border-border-default focus:border-accent-blue"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="rounded-3xl p-6 space-y-4 bg-brand-surface border border-border-default">
            <div className="flex items-center gap-2 text-brand-text-primary border-b pb-3 border-border-default">
              <CreditCard className="w-4.5 h-4.5 text-accent-blue" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Payment Method</h2>
            </div>

            <div className="p-4 rounded-2xl space-y-1 bg-accent-blue/10 border border-accent-blue/30">
              <p className="text-brand-text-primary font-bold text-sm">Cash on Delivery (USD)</p>
              <p className="text-xs text-brand-text-secondary">Pay USD cash directly to courier upon inspecting your sealed box.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1.5">
                Order Notes / Special Requests (Optional)
              </label>
              <textarea
                placeholder="e.g. Call before delivery, deliver after 3 PM"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full text-brand-text-primary rounded-xl p-3 outline-none text-sm bg-white/5 border border-border-default focus:border-accent-blue"
              />
            </div>
          </div>

        </div>

        {/* Right Form Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl p-6 space-y-4 sticky top-24 bg-brand-surface border border-border-default">
            <h2 className="text-base font-bold text-brand-text-primary uppercase tracking-wider border-b pb-3 border-border-default flex items-center gap-2">
              <ShoppingBag className="w-4.5 h-4.5 text-accent-blue" />
              <span>Checkout Items</span>
            </h2>

            <div className="divide-y divide-border-default max-h-48 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item._id} className="py-2.5 flex justify-between items-center text-xs gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-brand-text-primary font-medium truncate">{item.name}</p>
                    <p className="mt-0.5 text-brand-text-secondary">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-brand-text-primary font-semibold font-mono shrink-0">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3 text-xs sm:text-sm border-border-default">
              <div className="flex justify-between items-center text-brand-text-secondary">
                <span>Subtotal</span>
                <span className="text-brand-text-primary font-semibold font-mono">${cartSubtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center text-brand-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-green-500" />
                  <span>Nationwide Delivery</span>
                </span>
                <span className="text-brand-text-primary font-semibold font-mono">${deliveryFee.toLocaleString()}</span>
              </div>

              <div className="border-t pt-3 flex justify-between items-center text-base border-border-default">
                <span className="text-brand-text-primary font-semibold">Total Cost</span>
                <span className="text-green-500 font-extrabold font-mono text-lg">
                  ${(cartSubtotal + deliveryFee).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cartItems.length === 0}
              className="w-full btn-primary justify-center py-3.5 mt-6 rounded-2xl"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Confirming Order...</span>
                </>
              ) : (
                <span>Confirm Order</span>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
