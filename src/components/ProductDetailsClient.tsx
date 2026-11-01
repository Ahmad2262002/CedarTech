'use client';

import React, { useState } from 'react';
import { useCart } from 'src/lib/context/CartContext';
import { useAuth } from 'src/lib/context/AuthContext';
import { useTranslation } from 'src/context/LanguageContext';
import { getLocalizedProduct } from 'src/lib/getLocalizedProduct';
import { ShoppingBag, ShieldCheck, Plus, Minus, CreditCard, Send, ChevronLeft, ChevronRight, Maximize2, X, Check, FileText, TableProperties } from 'lucide-react';
import { Button } from './ui/Button';

interface ProductDetailsClientProps {
  product: {
    _id: string;
    name: string;
    brand: string;
    price: number;
    stock: number;
    images: string[];
    description: string;
    shortDescription?: string;
    warrantyInfo?: string;
    availabilityStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
    specifications?: Record<string, string>;
    translations?: Record<string, any>;
  };
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { locale, t } = useTranslation();
  const localized = getLocalizedProduct(product, locale);

  const images = product.images && product.images.length > 0 ? product.images : ['/images/placeholder.jpg'];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedFlash, setAddedFlash] = useState(false);
  const { addToCart } = useCart();
  const { requireAuth } = useAuth();

  const handlePrevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleQuantityChange = (val: number) => {
    const newVal = Math.max(1, Math.min(val, product.stock));
    setQuantity(newVal);
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    requireAuth(() => {
      addToCart(product, quantity);
      setAddedFlash(true);
      setTimeout(() => setAddedFlash(false), 1500);
    });
  };

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Hello Agha Tech plus, I would like to order:\n- ${product.brand} ${localized.name} (Qty: ${quantity})\nPrice: $${product.price} each.\nTotal: $${product.price * quantity}`
    );
    window.open(`https://wa.me/96176743718?text=${text}`, '_blank');
  };

  const isOutOfStock = product.stock <= 0 || product.availabilityStatus === 'out_of_stock';
  const isLowStock = !isOutOfStock && (product.stock <= 3 || product.availabilityStatus === 'low_stock');

  const currentImage = images[activeIndex] || images[0];
  const specsEntries = Object.entries(localized.specifications || {});

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* 1. Left Column: Image Gallery */}
        <div className="space-y-4">
          {/* Main Display Box */}
          <div className="aspect-square rounded-3xl flex items-center justify-center p-8 overflow-hidden relative group bg-brand-surface border border-border-default shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent pointer-events-none" />
            <img
              src={currentImage}
              alt={localized.name}
              className="max-h-full max-w-full object-contain cursor-pointer transition-transform duration-500 group-hover:scale-105 z-10"
              onClick={() => setIsLightboxOpen(true)}
            />

            {/* Carousel Controls */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-border-default bg-brand-surface text-brand-text-primary backdrop-blur-md transition-all active:scale-95 opacity-0 group-hover:opacity-100 z-20 hover:bg-brand-elevated shadow-sm"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-border-default bg-brand-surface text-brand-text-primary backdrop-blur-md transition-all active:scale-95 opacity-0 group-hover:opacity-100 z-20 hover:bg-brand-elevated shadow-sm"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Badge indicator */}
            <div className="absolute bottom-4 left-4 text-brand-text-primary text-xs font-mono px-3 py-1 rounded-full bg-brand-surface/80 backdrop-blur-md border border-border-default shadow-sm z-20">
              <span>{activeIndex + 1} / {images.length}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="absolute bottom-4 right-4 text-brand-text-primary p-2 rounded-full bg-brand-surface/80 backdrop-blur-md border border-border-default shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-brand-elevated"
              title="Expand Image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto py-2 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-24 h-24 rounded-2xl flex items-center justify-center p-3 shrink-0 transition-all bg-brand-elevated border ${
                    activeIndex === idx ? 'border-accent-bright shadow-[0_0_15px_rgba(41,151,255,0.2)] opacity-100' : 'border-border-default opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Preview ${idx + 1}`} className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Right Column: Details & Actions */}
        <div className="space-y-8 flex flex-col justify-between py-2">
          <div className="space-y-6">
            
            {/* Brand & Name */}
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-accent-bright">
                {product.brand}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-text-primary tracking-tight leading-tight mt-2">
                {localized.name}
              </h1>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-3">
              {isOutOfStock ? (
                <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">
                  {t('product.out_of_stock', 'Out of Stock')}
                </span>
              ) : isLowStock ? (
                <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  {t('product.low_stock', `Only ${product.stock} Left In Stock`)}
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">
                  {t('product.in_stock', 'In Stock')} ({product.stock} units)
                </span>
              )}

              {localized.warrantyInfo && (
                <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-white/5 border border-border-default text-brand-text-primary">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>{localized.warrantyInfo}</span>
                </span>
              )}
            </div>

            {/* Pricing */}
            <div className="py-6 border-y border-border-default">
              <span className="text-xs uppercase font-bold tracking-wider block text-brand-text-secondary">
                {t('cart.price', 'Unit Price')}
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-brand-text-primary font-black text-4xl lg:text-5xl tracking-tight">
                  ${product.price.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-brand-text-secondary">USD</span>
              </div>
              <p className="text-sm mt-3 text-brand-text-tertiary">
                {t('common.official_unit', 'Official sealed unit. Fast delivery & cash payment on delivery.')}
              </p>
            </div>

            {/* Quantity selector */}
            {!isOutOfStock && (
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary">
                  {t('cart.quantity', 'Quantity')}
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="flex items-center rounded-xl p-1.5 bg-white/5 border border-border-default w-max">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="p-2 rounded-lg transition-colors text-brand-text-primary hover:bg-white/10"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-base text-brand-text-primary px-6 font-extrabold">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="p-2 rounded-lg transition-colors text-brand-text-primary hover:bg-white/10 disabled:opacity-30"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <span className="text-sm font-mono font-semibold text-brand-text-secondary">
                    {t('cart.total', 'Total')}: <strong className="text-brand-text-primary font-black text-lg">${(product.price * quantity).toLocaleString()}</strong>
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-8 border-t border-border-default">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                size="lg"
                variant={isOutOfStock ? 'ghost' : 'primary'}
                className={`flex-1 !rounded-full ${addedFlash ? '!bg-green-500 shadow-[0_4px_24px_rgba(48,209,88,0.35)]' : ''}`}
              >
                {addedFlash ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    <span>{t('product.added', 'Added to Shopping Cart')}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    <span>{isOutOfStock ? t('product.unavailable', 'Unavailable') : t('product.add_to_cart', 'Add to Cart')}</span>
                  </>
                )}
              </Button>

              <Button
                onClick={handleWhatsAppOrder}
                disabled={isOutOfStock}
                size="lg"
                className="flex-1 !bg-green-500 hover:!bg-green-600 !rounded-full shadow-[0_4px_24px_rgba(48,209,88,0.35)]"
              >
                <Send className="w-5 h-5 mr-2 fill-white" />
                <span>{t('product.whatsapp_order', 'Order via WhatsApp')}</span>
              </Button>
            </div>

            <div className="flex items-center gap-2 justify-center text-xs text-brand-text-tertiary">
              <CreditCard className="w-4 h-4" />
              <span>Fast delivery across Lebanon.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Description & Technical Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-10 border-t border-white/10">
        
        {/* Description Overview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <FileText className="w-5 h-5 text-accent-bright" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              {t('product.description', 'Product Overview')}
            </h2>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-line text-brand-text-secondary">
            {localized.description || product.description}
          </p>
        </div>

        {/* Technical Specs Table */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <TableProperties className="w-5 h-5 text-accent-bright" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              {t('product.specifications', 'Technical Specifications')}
            </h2>
          </div>
          
          {specsEntries.length === 0 ? (
            <p className="text-sm italic text-brand-text-tertiary">No detailed specifications listed.</p>
          ) : (
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-brand-surface">
              <table className="w-full text-left rtl:text-right border-collapse text-sm">
                <tbody>
                  {specsEntries.map(([key, value]: [string, string], idx: number) => (
                    <tr
                      key={key}
                      className={`border-b border-white/10 last:border-none ${idx % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`}
                    >
                      <td className="p-4 font-semibold text-brand-text-secondary w-1/3 border-r rtl:border-r-0 rtl:border-l border-white/10 uppercase tracking-wide text-xs">
                        {key}
                      </td>
                      <td className="p-4 text-white font-medium">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[60]"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-full max-w-5xl h-full relative flex items-center justify-center">
            <img src={currentImage} alt={localized.name} className="max-h-[85vh] max-w-full object-contain" />

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 lg:left-10 text-white p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 lg:right-10 text-white p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
