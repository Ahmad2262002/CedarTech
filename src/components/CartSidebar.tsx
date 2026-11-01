'use client';

import React, { useRef, useEffect } from 'react';
import { useCart } from 'src/lib/context/CartContext';
import { useAuth } from 'src/lib/context/AuthContext';
import { useTranslation } from 'src/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

export default function CartSidebar() {
  const { cartItems, cartSubtotal, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart } = useCart();
  const { requireAuth } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    if (isCartOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    requireAuth(() => {
      router.push('/checkout');
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
      <div className="absolute inset-0 -z-10" onClick={() => setIsCartOpen(false)} />

      <div
        ref={sidebarRef}
        className="w-full max-w-md h-full flex flex-col relative bg-brand-surface border-l border-border-default shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-border-default flex items-center justify-between">
          <div className="flex items-center gap-3 text-brand-text-primary">
            <ShoppingBag className="w-5 h-5 text-accent-bright" />
            <h2 className="text-xl font-bold tracking-tight">{t('cart.title', 'Shopping Cart')}</h2>
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-accent-blue/20 text-accent-bright">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-brand-text-secondary hover:text-brand-text-primary hover:bg-white/5 p-2 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/5 border border-border-default mb-6">
                <ShoppingBag className="w-8 h-8 text-brand-text-tertiary" />
              </div>
              <h3 className="text-brand-text-primary font-bold text-lg tracking-tight">{t('cart.empty', 'Your cart is empty')}</h3>
              <p className="text-sm mt-2 text-brand-text-secondary max-w-[240px]">
                {t('cart.empty_subtitle', 'Add some flagship electronics to get started!')}
              </p>
              <Button
                variant="ghost"
                onClick={() => setIsCartOpen(false)}
                className="mt-8"
              >
                {t('cart.browse', 'Browse Catalog')}
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 p-4 rounded-2xl bg-brand-elevated border border-border-default shadow-sm"
              >
                <div className="relative w-20 h-20 rounded-xl shrink-0 overflow-hidden flex items-center justify-center p-2 bg-white/5 border border-border-default">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-accent-bright">
                      {item.brand}
                    </span>
                    <h4 className="text-brand-text-primary font-semibold text-sm line-clamp-1 mt-1">{item.name}</h4>
                    <p className="text-green-600 text-sm font-bold mt-1">
                      ${item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center rounded-lg bg-white/5 border border-border-default p-1">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="text-brand-text-secondary hover:text-brand-text-primary p-1 rounded hover:bg-white/5 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs text-brand-text-primary px-3 font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="text-brand-text-secondary hover:text-brand-text-primary disabled:opacity-30 p-1 rounded hover:bg-white/5 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-brand-text-tertiary hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info & subtotal */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-border-default bg-brand-surface space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-brand-text-secondary font-medium">{t('cart.subtotal', 'Subtotal')}</span>
              <span className="text-brand-text-primary font-bold text-xl">${cartSubtotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-brand-text-tertiary">
              {t('cart.delivery_note', 'Fast delivery available. Cash on delivery in USD.')}
            </p>
            <Button
              onClick={handleCheckout}
              fullWidth
              size="lg"
            >
              <span>{t('cart.checkout', 'Proceed to Checkout')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
