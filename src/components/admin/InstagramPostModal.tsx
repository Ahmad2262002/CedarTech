'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X, Copy, Check, Download, ExternalLink, Share2,
  Sparkles, MessageSquare, ShieldCheck, Tag, Globe, ArrowRight
} from 'lucide-react';

export function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  stock?: number;
  slug?: string;
  description?: string;
  shortDescription?: string;
  images?: string[];
  specifications?: Record<string, string>;
}

interface InstagramPostModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isNew?: boolean;
}

export default function InstagramPostModal({
  product,
  isOpen,
  onClose,
  isNew = false,
}: InstagramPostModalProps) {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [captionText, setCaptionText] = useState('');
  const [activeTab, setActiveTab] = useState<'caption' | 'graphic'>('caption');
  const [canvasReady, setCanvasReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Determine direct product link on the store
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://aghatechplus.com';
  const productIdentifier = product?.slug || product?._id || '';
  const storeUrl = product ? `${origin}/products/${productIdentifier}` : '';

  // Initial caption generation
  useEffect(() => {
    if (!product) return;

    const specs = product.specifications || {};
    const topSpecs = Object.entries(specs)
      .slice(0, 4)
      .map(([k, v]) => `• ${k}: ${v}`)
      .join('\n');

    const caption = `🔥 NEW IN STOCK at Agha Tech plus! 🔥

⚡ ${product.brand} - ${product.name}
💰 Price: $${product.price.toLocaleString()} USD
${topSpecs ? `\n✨ Key Highlights:\n${topSpecs}\n` : ''}
📦 100% Genuine & Factory Sealed
🛡️ 1-Year Local Warranty Support
🚚 Nationwide Doorstep Delivery across Lebanon
💵 Cash on Delivery (COD) — Inspect your package before you pay!

🔗 Order directly on our store:
${storeUrl}

📲 Or DM us / WhatsApp +961 76 743 718 to order instantly!

#AghaTechPlus #Lebanon #TechLebanon #Beirut #ElectronicsLebanon #AppleLebanon #GamingLebanon #OnlineShoppingLebanon #CashOnDeliveryLebanon #TechDeals`;

    setCaptionText(caption);
  }, [product, storeUrl]);

  // Generate 1080x1080 Instagram post canvas
  useEffect(() => {
    if (!product || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0a0d14');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative ambient circles
    const rad1 = ctx.createRadialGradient(200, 200, 0, 200, 200, 400);
    rad1.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
    rad1.addColorStop(1, 'transparent');
    ctx.fillStyle = rad1;
    ctx.fillRect(0, 0, width, height);

    const rad2 = ctx.createRadialGradient(880, 880, 0, 880, 880, 450);
    rad2.addColorStop(0, 'rgba(168, 85, 247, 0.15)');
    rad2.addColorStop(1, 'transparent');
    ctx.fillStyle = rad2;
    ctx.fillRect(0, 0, width, height);

    // Header branding
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 36px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('AGHA TECH', 70, 95);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText('PLUS', 310, 95);

    // Verified badge
    ctx.beginPath();
    ctx.arc(430, 85, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#0ea5e9';
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('✓', 424, 91);

    // Top Right Pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(width - 320, 60, 250, 48, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(width - 295, 84, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('OFFICIAL STORE', width - 275, 90);

    // Product Card Backing
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(70, 150, width - 140, 520, 36);
    ctx.fill();
    ctx.stroke();

    // Draw Image or Fallback
    const imageUrl = product?.images?.[0];
    if (imageUrl && !imageUrl.includes('placeholder')) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const maxImgSize = 440;
          let drawW = img.width;
          let drawH = img.height;
          const ratio = Math.min(maxImgSize / drawW, maxImgSize / drawH);
          drawW *= ratio;
          drawH *= ratio;
          const posX = (width - drawW) / 2;
          const posY = 170 + (480 - drawH) / 2;

          ctx.drawImage(img, posX, posY, drawW, drawH);
          drawPostDetails();
          setCanvasReady(true);
        } catch {
          drawFallbackImage();
          drawPostDetails();
          setCanvasReady(true);
        }
      };
      img.onerror = () => {
        drawFallbackImage();
        drawPostDetails();
        setCanvasReady(true);
      };
      img.src = imageUrl;
    } else {
      drawFallbackImage();
      drawPostDetails();
      setCanvasReady(true);
    }

    function drawFallbackImage() {
      if (!ctx) return;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
      ctx.beginPath();
      ctx.arc(width / 2, 400, 140, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 80px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(product ? product.brand.slice(0, 2).toUpperCase() : 'AT', width / 2, 430);
      ctx.textAlign = 'left';
    }

    function drawPostDetails() {
      if (!ctx || !product) return;

      // Brand
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText(product.brand.toUpperCase(), 70, 730);

      // Product Name (with line truncate)
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 50px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      let title = product.name;
      if (title.length > 32) title = title.slice(0, 30) + '...';
      ctx.fillText(title, 70, 795);

      // Price Pill
      const priceText = `$${product.price.toLocaleString()} USD`;
      ctx.font = '900 38px sans-serif';
      const textWidth = ctx.measureText(priceText).width;
      const pillWidth = textWidth + 60;

      const priceGrad = ctx.createLinearGradient(70, 830, 70 + pillWidth, 830);
      priceGrad.addColorStop(0, '#0284c7');
      priceGrad.addColorStop(1, '#6366f1');
      ctx.fillStyle = priceGrad;
      ctx.beginPath();
      ctx.roundRect(70, 825, pillWidth, 64, 32);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillText(priceText, 100, 870);

      // Right Feature Badges
      const badges = ['📦 Sealed Unit', '💵 Cash on Delivery', '🛡️ 1-Yr Local Warranty'];
      let badgeY = 835;
      ctx.font = 'bold 18px sans-serif';
      badges.forEach((b) => {
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(b, width - 360, badgeY);
        badgeY += 28;
      });

      // Bottom Footer Bar
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.moveTo(70, 930);
      ctx.lineTo(width - 70, 930);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('Order Online:', 70, 975);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px monospace';
      const displayDomain = storeUrl.replace(/^https?:\/\//, '');
      const cleanDomain = displayDomain.length > 36 ? displayDomain.slice(0, 34) + '...' : displayDomain;
      ctx.fillText(cleanDomain, 225, 975);

      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('WhatsApp: +961 76 743 718', width - 420, 975);

      ctx.fillStyle = '#64748b';
      ctx.font = '16px sans-serif';
      ctx.fillText('Agha Tech plus · Official Lebanese E-Commerce Store · Delivered in Custom Sealed Packaging', 70, 1025);
    }
  }, [product, storeUrl]);

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(captionText);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownloadImage = () => {
    if (!product || !canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `AghaTechPlus-${product.name.replace(/[^a-zA-Z0-9]/g, '_')}-Instagram.png`;
      a.click();
    } catch {
      alert('Could not export canvas due to external image protection. You can take a screenshot of the preview or use the direct image!');
    }
  };

  const handleCopyImageToClipboard = async () => {
    if (!product || !canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        // @ts-ignore
        const item = new ClipboardItem({ 'image/png': blob });
        // @ts-ignore
        await navigator.clipboard.write([item]);
        alert('Post image copied to clipboard! You can paste it directly into Instagram or WhatsApp.');
      });
    } catch {
      alert('Direct image clipboard copy is not supported in this browser. Please click "Download Image (PNG)" instead.');
    }
  };

  const handleShareWhatsApp = () => {
    if (!product) return;
    const text = encodeURIComponent(
      `Check out ${product.brand} ${product.name} on Agha Tech plus!\nPrice: $${product.price} USD (Cash on Delivery)\n${storeUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#141517] border border-[#2c2d30] shadow-2xl p-6 md:p-8 space-y-6 my-6 text-white">

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#2c2d30] pb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg,#f58529 0%,#dd2a7b 50%,#8134af 100%)' }}
            >
              <InstagramIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-pink-400">
                  {isNew ? '🎉 Item Added Successfully!' : 'Instagram Post Studio'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/80">
                  Ready to Post
                </span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Instagram Post & Link Generator
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Quick Info Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {product?.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product?.name || 'Product'}
                className="w-14 h-14 rounded-xl object-contain bg-black/50 border border-white/10 p-1 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-black/50 flex items-center justify-center font-bold text-lg text-accent-blue border border-white/10 shrink-0">
                {(product?.brand || 'AT').slice(0, 2)}
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-blue block">
                {product?.brand}
              </span>
              <p className="font-bold text-white text-sm truncate">{product?.name}</p>
              <p className="text-xs text-emerald-400 font-mono font-bold mt-0.5">
                ${product?.price?.toLocaleString() || '0'} USD
              </p>
            </div>
          </div>

          {/* Store Direct Link */}
          <div className="w-full sm:w-auto flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs">
            <Globe className="w-4 h-4 text-accent-blue shrink-0" />
            <span className="font-mono text-neutral-300 truncate max-w-[200px] md:max-w-[260px]">
              {storeUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors ml-auto"
              title="Copy Store URL"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Tabs: Caption vs Graphic Visual */}
        <div className="flex items-center gap-2 border-b border-[#2c2d30] pb-3">
          <button
            onClick={() => setActiveTab('caption')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'caption'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            📝 Ready Caption & Link
          </button>
          <button
            onClick={() => setActiveTab('graphic')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'graphic'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            🎨 1080x1080 Post Graphic (Canvas)
          </button>
        </div>

        {/* TAB 1: Caption Text */}
        {activeTab === 'caption' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="text-neutral-400 font-semibold">
                  Instagram Caption (Auto-Generated with Store Link & WhatsApp):
                </label>
                <button
                  onClick={handleCopyCaption}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 border border-pink-500/30 font-bold transition-all"
                >
                  {copiedCaption ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Caption!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Caption</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={captionText}
                onChange={(e) => setCaptionText(e.target.value)}
                rows={11}
                className="w-full bg-black/50 border border-white/15 focus:border-pink-500 rounded-2xl p-4 text-xs font-mono text-neutral-200 outline-none transition-all leading-relaxed"
              />
            </div>

            {/* Quick Share Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg hover:opacity-90 transition-all"
                  style={{ background: 'linear-gradient(135deg,#f58529,#dd2a7b,#8134af)' }}
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Open Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-green-400" />
                  <span>Share to WhatsApp</span>
                </button>

                <a
                  href={storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/5 text-neutral-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
                >
                  <Globe className="w-4 h-4" />
                  <span>View Product on Store</span>
                </a>
              </div>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Visual Graphic Post Canvas */}
        {activeTab === 'graphic' && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              
              {/* Live Preview Container */}
              <div className="w-full md:w-[380px] aspect-square rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl relative shrink-0">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Graphic Controls & Downloads */}
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-base">Instagram Feed Post (1080 × 1080)</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Automatically styled with the official Agha Tech plus header, verified store badge, price pill, and your direct product link.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={handleDownloadImage}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:opacity-95 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Post Graphic (1080x1080 PNG)</span>
                  </button>

                  <button
                    onClick={handleCopyImageToClipboard}
                    className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold py-3 px-4 rounded-xl text-xs border border-white/10 transition-all"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Image to Clipboard</span>
                  </button>

                  <button
                    onClick={handleCopyCaption}
                    className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-neutral-300 font-semibold py-2.5 px-4 rounded-xl text-xs border border-white/5 transition-all"
                  >
                    {copiedCaption ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCaption ? 'Caption Copied!' : 'Copy Accompanying Caption'}</span>
                  </button>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 font-semibold underline underline-offset-4"
                  >
                    <span>Open Instagram Web</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
