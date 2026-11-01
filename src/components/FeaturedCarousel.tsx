'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, ChevronLeft, ChevronRight,
  Star, ShieldCheck, Zap, ArrowRight,
} from 'lucide-react';
import { useCart } from 'src/lib/context/CartContext';
import { useTranslation } from 'src/context/LanguageContext';
import { getLocalizedProduct } from 'src/lib/getLocalizedProduct';

interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  images: string[];
  description: string;
  availabilityStatus: string;
  isFeatured?: boolean;
  category?: { name: string };
  warrantyInfo?: string;
  stock?: number;
  translations?: Record<string, any>;
  specifications?: Record<string, string>;
}

interface Props { products: Product[] }

/* Accent colours per slot — cycles as slides change */
const SLOT_ACCENTS = [
  { glow: 'rgba(0,119,237,0.18)',  badge: '#2997ff', badgeBg: 'rgba(0,119,237,0.12)', badgeBorder: 'rgba(0,119,237,0.25)' },
  { glow: 'rgba(94,92,230,0.18)',  badge: '#a78bfa', badgeBg: 'rgba(94,92,230,0.12)', badgeBorder: 'rgba(94,92,230,0.25)' },
  { glow: 'rgba(52,199,89,0.15)',  badge: '#34c759', badgeBg: 'rgba(52,199,89,0.12)', badgeBorder: 'rgba(52,199,89,0.25)' },
  { glow: 'rgba(255,159,10,0.15)', badge: '#ff9f0a', badgeBg: 'rgba(255,159,10,0.12)', badgeBorder: 'rgba(255,159,10,0.25)' },
  { glow: 'rgba(255,69,58,0.15)',  badge: '#ff453a', badgeBg: 'rgba(255,69,58,0.12)', badgeBorder: 'rgba(255,69,58,0.25)' },
  { glow: 'rgba(0,210,190,0.15)',  badge: '#00d2be', badgeBg: 'rgba(0,210,190,0.12)', badgeBorder: 'rgba(0,210,190,0.25)' },
];

export default function FeaturedCarousel({ products }: Props) {
  const { addToCart } = useCart();
  const { locale, t } = useTranslation();
  const [active, setActive]         = useState(0);
  const [prev, setPrev]             = useState<number | null>(null);
  const [direction, setDirection]   = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused]     = useState(false);
  const [addedFlash, setAddedFlash] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = products.length;

  const goTo = useCallback((idx: number, dir: 'left' | 'right') => {
    if (isAnimating || idx === active) return;
    setPrev(active);
    setDirection(dir);
    setActive(idx);
    setIsAnimating(true);
    setTimeout(() => { setPrev(null); setIsAnimating(false); }, 600);
  }, [isAnimating, active]);

  const goNext = useCallback(() => goTo((active + 1) % total, 'right'), [active, total, goTo]);
  const goPrev = useCallback(() => goTo((active - 1 + total) % total, 'left'), [active, total, goTo]);

  /* Auto-play */
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    timerRef.current = setInterval(goNext, 5500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [goNext, total, isPaused]);

  if (!products.length) return null;

  const prod    = products[active];
  const accent  = SLOT_ACCENTS[active % SLOT_ACCENTS.length];

  const isOutOfStock = prod.availabilityStatus === 'out_of_stock';

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart({ _id: prod._id, name: prod.name, price: prod.price, images: prod.images, brand: prod.brand, availabilityStatus: prod.availabilityStatus });
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1800);
  };

  /* Slide in/out style helper */
  const slideStyle = (isCurrent: boolean, isPrevSlide: boolean): React.CSSProperties => {
    if (!isAnimating) {
      return { opacity: isCurrent ? 1 : 0, transform: 'translateX(0)', position: 'absolute', inset: 0, transition: 'none' };
    }
    const exitTo = direction === 'right' ? '-40px' : '40px';
    if (isCurrent) return {
      opacity: 1,
      transform: 'translateX(0)',
      position: 'absolute', inset: 0,
      animation: `carousel-enter-${direction} 0.6s cubic-bezier(.22,1,.36,1) both`,
    };
    if (isPrevSlide) return {
      opacity: 0,
      transform: `translateX(${exitTo})`,
      position: 'absolute', inset: 0,
      transition: 'all 0.45s cubic-bezier(.22,1,.36,1)',
    };
    return { opacity: 0, position: 'absolute', inset: 0 };
  };

  return (
    <>
      {/* Inject keyframes */}
      <style>{`
        @keyframes carousel-enter-right {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes carousel-enter-left {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes img-float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes img-enter {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes glow-breathe {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 0.9; transform: scale(1.08); }
        }
      `}</style>

      <div
        className="relative w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* ── MAIN SHOWCASE CARD ─────────────────────────── */}
        <div
          className="relative rounded-3xl overflow-hidden border border-border-default"
          style={{
            background: 'linear-gradient(145deg, #0d0d0f 0%, #111113 40%, #0a0a0c 100%)',
            minHeight: '520px',
          }}
        >
          {/* Dynamic ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-1000"
            style={{
              background: `
                radial-gradient(ellipse 55% 65% at 72% 48%, ${accent.glow} 0%, transparent 65%),
                radial-gradient(ellipse 40% 50% at 15% 80%, rgba(255,255,255,0.02) 0%, transparent 60%)
              `,
            }}
          />

          {/* Subtle dot grid texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Slide container */}
          <div className="relative" style={{ minHeight: '520px' }}>
            {products.map((p, i) => {
              const isCur  = i === active;
              const isPrev = i === prev;
              if (!isCur && !isPrev) return null;

              const localizedP = getLocalizedProduct(p, locale);
              const pAccent = SLOT_ACCENTS[i % SLOT_ACCENTS.length];
              const pImg    = p.images?.[0] || '';
              const pOutOfStock = p.availabilityStatus === 'out_of_stock';
              const pLowStock   = !pOutOfStock && p.availabilityStatus === 'low_stock';

              return (
                <div
                  key={p._id}
                  style={slideStyle(isCur, isPrev)}
                  className="grid grid-cols-1 md:grid-cols-2 items-center h-full"
                >
                  {/* LEFT — Product Details ─────────────────── */}
                  <div className="flex flex-col justify-center p-8 md:p-14 space-y-6 z-10">

                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2">
                      {p.category?.name && (
                        <span
                          className="text-[9px] font-black uppercase tracking-[0.18em] px-3 py-1 rounded-full border"
                          style={{ background: pAccent.badgeBg, borderColor: pAccent.badgeBorder, color: pAccent.badge }}
                        >
                          {p.category.name}
                        </span>
                      )}
                      {pOutOfStock ? (
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                          {t('product.out_of_stock', 'Out of Stock')}
                        </span>
                      ) : pLowStock ? (
                        <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Zap className="w-2.5 h-2.5" /> {t('product.low_stock', 'Low Stock')}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {t('product.in_stock', 'In Stock')}
                        </span>
                      )}
                    </div>

                    {/* Brand */}
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-text-tertiary">
                      {p.brand}
                    </p>

                    {/* Name */}
                    <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-white">
                      {localizedP.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-brand-text-secondary leading-relaxed line-clamp-3 max-w-md">
                      {localizedP.description || p.description}
                    </p>

                    {/* Warranty */}
                    {localizedP.warrantyInfo && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span>{localizedP.warrantyInfo}</span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-5xl font-black tracking-tighter text-white">
                        ${p.price.toLocaleString()}
                      </span>
                      <span className="text-sm font-bold text-brand-text-tertiary uppercase tracking-wider">
                        USD · COD
                      </span>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={isCur ? handleCart : undefined}
                        disabled={pOutOfStock}
                        className="flex items-center gap-2 font-bold text-sm py-3 px-6 rounded-2xl transition-all duration-300 active:scale-95 disabled:opacity-40"
                        style={{
                          background: addedFlash && isCur ? 'rgba(52,199,89,0.15)' : `${pAccent.badgeBg}`,
                          border: `1px solid ${addedFlash && isCur ? 'rgba(52,199,89,0.3)' : pAccent.badgeBorder}`,
                          color: addedFlash && isCur ? '#34c759' : pAccent.badge,
                          boxShadow: `0 8px 24px ${pAccent.glow}`,
                        }}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        {addedFlash && isCur ? t('product.added', 'Added ✓') : t('product.add_to_cart', 'Add to Cart')}
                      </button>

                      <Link
                        href={`/products/${p._id}`}
                        className="flex items-center gap-2 font-semibold text-sm py-3 px-6 rounded-2xl bg-white/5 border border-border-default text-brand-text-secondary hover:text-white hover:bg-white/10 transition-all"
                      >
                        {t('common.view_details', 'View Details')}
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                      </Link>
                    </div>
                  </div>

                  {/* RIGHT — Product Image (Guaranteed non-clipping) ──────────── */}
                  <div className="relative flex items-center justify-center p-8 md:p-12 min-h-[320px] md:min-h-[520px] overflow-hidden">

                    {/* Glow orb behind image */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${pAccent.glow} 0%, transparent 70%)`,
                        animation: isCur ? 'glow-breathe 5s ease-in-out infinite' : 'none',
                      }}
                    />

                    {/* Rating badge */}
                    <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-border-default px-3 py-1.5 rounded-full">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-white">4.9</span>
                    </div>

                    {/* Product image */}
                    {pImg ? (
                      <div className="relative z-10 w-full h-full max-h-[340px] flex items-center justify-center p-4">
                        <img
                          src={pImg}
                          alt={p.name}
                          className="max-h-[320px] max-w-full object-contain select-none"
                          style={{
                            filter: `drop-shadow(0 24px 44px rgba(0,0,0,0.65)) drop-shadow(0 0 30px ${pAccent.glow})`,
                            animation: isCur ? 'img-float 6s ease-in-out infinite, img-enter 0.6s cubic-bezier(.22,1,.36,1) both' : 'none',
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-56 h-56 rounded-3xl bg-brand-elevated border border-border-default flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-brand-text-tertiary" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prev / Next nav buttons */}
          <button
            onClick={goPrev}
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full flex items-center justify-center border border-border-default text-white transition-all duration-200 hover:bg-white/10 active:scale-90"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full flex items-center justify-center border border-border-default text-white transition-all duration-200 hover:bg-white/10 active:scale-90"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Bottom gradient fade */}
          <div
            className="absolute bottom-0 inset-x-0 h-20 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(10,10,12,0.5) 0%, transparent 100%)' }}
          />
        </div>

        {/* ── SLIDE PICKER ROW ───────────────────────────── */}
        <div className="flex items-center gap-4 mt-6 overflow-x-auto scrollbar-none pb-1">
          {products.map((p, i) => {
            const isCur = i === active;
            const pAccent = SLOT_ACCENTS[i % SLOT_ACCENTS.length];
            return (
              <button
                key={p._id}
                onClick={() => goTo(i, i > active ? 'right' : 'left')}
                aria-label={p.name}
                className="flex items-center gap-3 rounded-2xl border transition-all duration-300 shrink-0 text-left"
                style={{
                  padding: isCur ? '10px 14px' : '8px 10px',
                  background: isCur ? pAccent.badgeBg : 'rgba(255,255,255,0.03)',
                  borderColor: isCur ? pAccent.badgeBorder : 'rgba(255,255,255,0.08)',
                  boxShadow: isCur ? `0 4px 20px ${pAccent.glow}` : 'none',
                }}
              >
                {/* Thumbnail */}
                <div
                  className="rounded-xl overflow-hidden flex items-center justify-center transition-all duration-300 p-1"
                  style={{
                    width: isCur ? '44px' : '36px',
                    height: isCur ? '44px' : '36px',
                    background: '#1c1c1e',
                    border: `1px solid ${isCur ? pAccent.badgeBorder : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <ShoppingBag className="w-4 h-4 text-brand-text-tertiary" />
                  )}
                </div>

                {/* Name — only visible on active */}
                {isCur && (
                  <div className="overflow-hidden max-w-[120px]">
                    <p className="text-[10px] font-black uppercase tracking-wider truncate" style={{ color: pAccent.badge }}>
                      {p.brand}
                    </p>
                    <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                  </div>
                )}
              </button>
            );
          })}

          {/* Progress bar */}
          <div className="flex-1 min-w-[60px] h-0.5 rounded-full bg-border-default overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((active + 1) / total) * 100}%`,
                background: SLOT_ACCENTS[active % SLOT_ACCENTS.length].badge,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
