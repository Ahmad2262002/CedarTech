'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from 'src/lib/context/CartContext';
import { useAuth } from 'src/lib/context/AuthContext';
import { useTranslation } from 'src/context/LanguageContext';
import { getLocalizedProduct } from 'src/lib/getLocalizedProduct';
import { ShoppingBag, ShieldCheck, Zap, Check, Eye } from 'lucide-react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  slug?: string;
  brand: string;
  price: number;
  stock: number;
  images: string[];
  warrantyInfo?: string;
  availabilityStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  translations?: Record<string, any>;
  specifications?: Record<string, string>;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { requireAuth } = useAuth();
  const { locale, t } = useTranslation();
  const localized = getLocalizedProduct(product, locale);

  const images = product.images?.length > 0 ? product.images : ['/images/placeholder.jpg'];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [addedFlash, setAddedFlash] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isPressed, setIsPressed] = useState(false);

  /* ── Auto-cycle images on hover ── */
  useEffect(() => {
    if (isHovered && images.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIdx((p) => (p + 1) % images.length);
      }, 1800);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (!isHovered) setCurrentIdx(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isHovered, images.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const tiltX = (y / rect.height) - 0.5;
    const tiltY = (x / rect.width) - 0.5;
    
    // Rotate maximum 6 degrees for a subtle and clean feel
    const maxTilt = 6;
    setTilt({
      x: -(tiltX * maxTilt),
      y: tiltY * maxTilt,
    });

    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;
    setGlowPos({ x: pctX, y: pctY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    setTilt({ x: 0, y: 0 });
    setGlowPos({ x: 50, y: 50 });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    requireAuth(() => {
      addToCart(product, 1);
      setAddedFlash(true);
      setTimeout(() => setAddedFlash(false), 1800);
    });
  };

  const isOutOfStock = product.stock <= 0 || product.availabilityStatus === 'out_of_stock';
  const isLowStock  = !isOutOfStock && (product.stock <= 3 || product.availabilityStatus === 'low_stock');

  // Brand-specific adaptive glow color mapping
  const getBrandGlowColor = (brandName: string) => {
    const normalized = brandName.toLowerCase();
    if (normalized.includes('nvidia')) return 'rgba(118,185,0,0.22)';
    if (normalized.includes('amd')) return 'rgba(237,28,36,0.22)';
    if (normalized.includes('razer')) return 'rgba(68,214,44,0.22)';
    if (normalized.includes('intel') || normalized.includes('samsung') || normalized.includes('dell') || normalized.includes('asus') || normalized.includes('msi')) return 'rgba(0,119,237,0.22)';
    if (normalized.includes('apple') || normalized.includes('google') || normalized.includes('nothing') || normalized.includes('sony')) return 'rgba(255,255,255,0.18)';
    return 'rgba(0,119,237,0.22)'; // fallback blue
  };

  const brandGlow = getBrandGlowColor(product.brand);

  return (
    <Link
      href={`/products/${product._id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className="group relative flex flex-col rounded-[32px] border border-white/[0.08] bg-[#0a0a0c] transition-all duration-500"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHovered ? -8 : 0}px) scale(${isPressed ? 0.98 : 1})`,
        boxShadow: isHovered
          ? isPressed
            ? '0 12px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)'
            : '0 32px 64px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.08)'
          : '0 2px 8px rgba(0,0,0,0.3)',
        transition: isPressed
          ? 'transform 0.05s ease-out, box-shadow 0.05s ease-out'
          : isHovered
          ? 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease'
          : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        transformStyle: 'preserve-3d',
        minHeight: '480px',
      }}
    >
      {/* Dynamic Keyframes for self-contained animations */}
      <style>{`
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-gentle-float {
          animation: gentle-float 4s ease-in-out infinite;
        }
      `}</style>

      {/* Adaptive Brand Background Glow tracking cursor */}
      <div
        className="absolute inset-0 rounded-[32px] pointer-events-none transition-opacity duration-700 z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          backgroundImage: `radial-gradient(circle 80% 80% at ${glowPos.x}% ${glowPos.y}%, ${brandGlow} 0%, transparent 80%)`,
        }}
      />

      {/* Holographic Chromatic Flare (Rainbow Sheen) */}
      <div
        className="absolute inset-0 rounded-[32px] pointer-events-none z-25 transition-opacity duration-700"
        style={{
          opacity: isHovered ? 0.07 : 0,
          mixBlendMode: 'color-dodge',
          backgroundImage: `linear-gradient(${glowPos.x + glowPos.y}deg, #ff007f 0%, #7f00ff 30%, #00f0ff 70%, #ff007f 100%)`,
          backgroundSize: '200% 200%',
          backgroundPosition: `${glowPos.x}% ${glowPos.y}%`,
          transition: 'opacity 0.7s ease',
        }}
      />

      {/* Glassmorphic light sweep reflection */}
      <div
        className="absolute inset-0 rounded-[32px] pointer-events-none z-30"
        style={{
          backgroundImage: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.01) 35%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.01) 65%, transparent 80%)',
          transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
          transition: isHovered ? 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
        }}
      />

      {/* Laser-Traced Border Spotlight Outline */}
      <div
        className="absolute inset-0 rounded-[32px] pointer-events-none z-30 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          border: '1.5px solid transparent',
          backgroundImage: `radial-gradient(circle 120px at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.2) 0%, transparent 70%)`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'border-box',
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'destination-out',
          maskComposite: 'exclude',
        }}
      />

      {/* Background gradients for text contrast */}
      <div className="absolute top-0 inset-x-0 h-44 rounded-t-[32px] bg-gradient-to-b from-black/85 via-black/45 to-transparent z-15 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-36 rounded-b-[32px] bg-gradient-to-t from-black/95 via-black/55 to-transparent z-15 pointer-events-none" />

      {/* Loading Shimmer/Skeleton */}
      {!imgLoaded && (
        <div className="absolute inset-0 bg-[#0a0a0c] rounded-[32px] animate-pulse flex items-center justify-center z-10 pointer-events-none">
          <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-accent-blue animate-spin" />
        </div>
      )}

      {/* ══ MASSIVE FLOATING IMAGE BACKGROUND LAYER (Z-Depth: 105px) ═════════ */}
      <div 
        className={`absolute inset-0 flex items-center justify-center p-4 z-10 pointer-events-none transition-transform duration-500 ${
          isHovered ? 'animate-gentle-float' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              opacity: idx === currentIdx ? 1 : 0,
              transform: idx === currentIdx
                ? isHovered
                  ? `scale(1.22) translate(${-tilt.y * 3.5}px, ${tilt.x * 3.5}px) rotateX(${-tilt.x * 2}deg) rotateY(${-tilt.y * 2}deg) translateZ(105px)`
                  : 'scale(1.02) translate(0px, 0px) translateZ(0px) rotateX(0deg) rotateY(0deg)'
                : 'scale(0.93) translateZ(0px) rotateX(0deg) rotateY(0deg)',
              transition: idx === currentIdx && isHovered
                ? 'opacity 0.55s cubic-bezier(.22,1,.36,1), transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)'
                : 'opacity 0.55s cubic-bezier(.22,1,.36,1), transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)',
              filter: isHovered && idx === currentIdx
                ? `drop-shadow(${tilt.y * 3.5}px ${32 + -tilt.x * 3.5}px 45px rgba(0,0,0,0.8))`
                : 'drop-shadow(0 8px 16px rgba(0,0,0,0.45))',
              transformStyle: 'preserve-3d',
            }}
          >
            <img
              src={img}
              alt={`${product.name} ${idx + 1}`}
              onLoad={() => idx === 0 && setImgLoaded(true)}
              className="absolute max-w-[85%] max-h-[66%] object-contain select-none pointer-events-none"
            />
            {/* Specular glare reflection on top of the image */}
            <div
              className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-500 rounded-[32px]"
              style={{
                opacity: isHovered ? 0.35 : 0,
                mixBlendMode: 'overlay',
                background: `radial-gradient(circle 120px at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.7) 0%, transparent 80%)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* ══ TOP INFO AREA (Z-Depth: 75px) ═════════════════════ */}
      <div 
        className="p-7 pb-2 space-y-1.5 relative z-20 transition-transform duration-300"
        style={{
          transform: isHovered ? 'translateZ(75px)' : 'translateZ(0px)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text-tertiary">
            {product.brand}
          </span>
          {localized.warrantyInfo && (
            <div className="flex items-center gap-1 opacity-90">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[10px] text-brand-text-tertiary truncate">{localized.warrantyInfo}</span>
            </div>
          )}
        </div>
        <h3 className="text-xl sm:text-[22px] font-bold tracking-tight text-white group-hover:text-accent-blue transition-colors duration-300 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          {localized.name}
        </h3>
        <div className="flex items-baseline gap-1 mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          <span className="text-lg font-black text-white">${product.price.toLocaleString()}</span>
          <span className="text-xs text-brand-text-tertiary ml-1">USD</span>
        </div>
      </div>

      {/* Quick-view button — appears on hover (Z-Depth: 125px) */}
      <div
        className="absolute top-28 right-6 z-25 transition-all duration-300"
        style={{ 
          opacity: isHovered ? 1 : 0, 
          transform: isHovered ? 'scale(1) translateZ(125px)' : 'scale(0.8) translateZ(0px)' 
        }}
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/25 backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 group/qv">
          <Eye className="w-4 h-4 text-white transition-transform duration-300 group-hover/qv:scale-110" />
        </div>
      </div>

      {/* Morphing Dot Indicators (Z-Depth: 70px) */}
      {images.length > 1 && (
        <div 
          className="absolute bottom-24 inset-x-0 flex items-center justify-center gap-1.5 z-25 transition-transform duration-300"
          style={{
            transform: isHovered ? 'translateZ(70px)' : 'translateZ(0px)',
          }}
        >
          {images.map((_, idx) => (
            <span
              key={idx}
              className="rounded-full transition-all duration-500 ease-out"
              style={{
                width: idx === currentIdx ? '18px' : '6px',
                height: '6px',
                background: idx === currentIdx 
                  ? 'linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)' 
                  : 'rgba(255,255,255,0.25)',
                boxShadow: idx === currentIdx ? '0 0 8px rgba(255,255,255,0.5)' : 'none',
              }}
            />
          ))}
        </div>
      )}

      {/* ══ ACTIONS / STATUS FOOTER (Z-Depth: 90px) ══════════════════════════ */}
      <div 
        className="p-7 pt-4 mt-auto flex items-center justify-between relative z-20 transition-transform duration-300"
        style={{
          transform: isHovered ? 'translateZ(90px)' : 'translateZ(0px)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Status Badge */}
        <div className="flex flex-col gap-1.5 pointer-events-none">
          {isOutOfStock ? (
            <span className="text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest bg-red-500/20 text-red-400 border border-red-500/30 backdrop-blur-md shadow-[0_2px_12px_rgba(239,68,68,0.2)]">
              {t('product.out_of_stock', 'Out of Stock')}
            </span>
          ) : isLowStock ? (
            <span className="flex items-center gap-1.5 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest bg-amber-500/20 text-amber-400 border border-amber-500/30 backdrop-blur-md shadow-[0_2px_12px_rgba(245,158,11,0.2)]">
              <span className="relative flex h-1.5 w-1.5 mr-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
              </span>
              {t('product.low_stock', `Only ${product.stock} left`)}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md shadow-[0_2px_12px_rgba(16,185,129,0.2)]">
              <span className="relative flex h-1.5 w-1.5 mr-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              {t('product.in_stock', 'In Stock')}
            </span>
          )}
        </div>

        {/* Add to Cart Button (Apple-style Blue Pill) */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex items-center gap-2 font-bold text-xs py-3 px-5 rounded-full transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed group/btn"
          style={{
            background: addedFlash
              ? '#30d158'
              : isOutOfStock
              ? 'rgba(255,255,255,0.05)'
              : 'var(--color-accent-blue)',
            border: `1px solid ${
              addedFlash
                ? '#30d158'
                : isOutOfStock
                ? 'rgba(255,255,255,0.1)'
                : 'var(--color-accent-blue)'
            }`,
            color: isOutOfStock ? '#636366' : '#ffffff',
            boxShadow: addedFlash
              ? '0 8px 24px rgba(48,209,88,0.45)'
              : isOutOfStock
              ? 'none'
              : isHovered 
              ? '0 12px 28px rgba(0,119,237,0.55)' 
              : '0 4px 12px rgba(0,119,237,0.15)',
            transform: isHovered && !isOutOfStock ? 'scale(1.06)' : 'scale(1)',
          }}
        >
          {addedFlash ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{t('product.added', 'Added')}</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:-translate-y-0.5" />
              <span>{isOutOfStock ? t('product.unavailable', 'Unavailable') : t('product.buy_now', 'Buy')}</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom accent line — glows on hover */}
      <div
        className="absolute bottom-0 inset-x-0 h-px transition-all duration-500 rounded-b-3xl"
        style={{
          opacity: isHovered ? 1 : 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,119,237,0.8) 50%, transparent 100%)',
          boxShadow: isHovered ? '0 0 10px rgba(0,119,237,0.6)' : 'none',
        }}
      />
    </Link>
  );
}
