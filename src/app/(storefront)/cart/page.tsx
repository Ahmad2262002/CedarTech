'use client';

import React from 'react';
import { useCart } from 'src/lib/context/CartContext';
import { useAuth } from 'src/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, cartSubtotal, updateQuantity, removeFromCart } = useCart();
  const { requireAuth } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    requireAuth(() => {
      router.push('/checkout');
    });
  };

  return (
    <div className="w-full max-w-[1160px] mx-auto px-6 py-12 space-y-8">
      {/* Header */}
      <div className="border-b pb-6" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Shopping Cart</h1>
        <p className="text-sm mt-1" style={{ color: '#86868b' }}>Review the selected electronics &amp; hardware</p>
      </div>

      {cartItems.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center text-center py-20 rounded-3xl p-8"
          style={{ background: '#0a0a0d', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center surface-glass mb-4">
            <ShoppingBag className="w-8 h-8 text-[#2997ff]" />
          </div>
          <h3 className="text-white font-bold text-lg">Your cart is currently empty</h3>
          <p className="text-sm mt-1 max-w-sm" style={{ color: '#86868b' }}>
            You haven&apos;t added any products to your cart yet. Explore our catalog to find flagship phones, laptops, and custom PC gear.
          </p>
          <Link
            href="/products"
            className="btn-primary mt-6"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl overflow-hidden" style={{ background: '#0d0d10', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="p-4 sm:p-6 border-b hidden sm:grid sm:grid-cols-12 gap-4 text-xs font-bold uppercase tracking-wider text-[#86868b]"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <span className="col-span-6">Product details</span>
                <span className="col-span-2 text-center">Price</span>
                <span className="col-span-2 text-center">Quantity</span>
                <span className="col-span-2 text-right">Total</span>
              </div>

              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                  >
                    
                    {/* Item Details */}
                    <div className="col-span-1 sm:col-span-6 flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1"
                        style={{ background: '#16161a', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#2997ff]">
                          {item.brand}
                        </span>
                        <h4 className="text-white font-semibold text-sm line-clamp-1 mt-0.5">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-[#86868b] hover:text-[#f43f5e] text-xs flex items-center gap-1 mt-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-1 sm:col-span-2 text-left sm:text-center flex sm:flex-col justify-between sm:justify-center border-t sm:border-none pt-2 sm:pt-0"
                      style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <span className="sm:hidden text-xs text-[#86868b] font-semibold uppercase">Price</span>
                      <span className="text-white text-sm font-semibold">${item.price.toLocaleString()}</span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="col-span-1 sm:col-span-2 flex sm:justify-center items-center justify-between border-t sm:border-none pt-2 sm:pt-0"
                      style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <span className="sm:hidden text-xs text-[#86868b] font-semibold uppercase">Quantity</span>
                      <div className="flex items-center rounded-lg p-1" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="text-[#86868b] hover:text-white p-0.5 rounded"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs text-white px-2.5 font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="text-[#86868b] hover:text-white disabled:opacity-30 p-0.5 rounded"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="col-span-1 sm:col-span-2 text-right flex sm:flex-col justify-between sm:justify-center border-t sm:border-none pt-2 sm:pt-0 font-mono"
                      style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <span className="sm:hidden text-xs text-[#86868b] font-semibold uppercase">Total</span>
                      <span className="text-[#30d158] text-sm font-bold">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Back to Catalog Link */}
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold transition-colors mt-2"
              style={{ color: '#86868b' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* Cart Pricing Card Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl p-6 space-y-4" style={{ background: '#0d0d10', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 className="text-base font-bold text-white uppercase tracking-wider border-b pb-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                Order Summary
              </h2>

              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center text-[#86868b]">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold font-mono">${cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[#86868b]">
                  <span>Shipping Fee</span>
                  <span className="italic text-xs">Calculated at checkout</span>
                </div>
                
                <div className="border-t pt-3 flex justify-between items-center text-base" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <span className="text-white font-semibold">Total Price</span>
                  <span className="text-white font-extrabold font-mono text-lg">${cartSubtotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-primary justify-center py-3.5 mt-6 rounded-2xl"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
