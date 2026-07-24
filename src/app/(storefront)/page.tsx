import React from 'react';
import connectDB from 'src/lib/db';
import Product from 'src/models/Product';
import Category from 'src/models/Category';
import ProductCard from 'src/components/ProductCard';
import FaqSection from 'src/components/FaqSection';
import HeroSearch from 'src/components/HeroSearch';
import FeaturedCarousel from 'src/components/FeaturedCarousel';
import Link from 'next/link';
import {
  Laptop, Smartphone, Cpu, Gamepad2, Headphones,
  ShieldCheck, Truck, MessageSquare, Keyboard, ChevronRight,
  Zap, Package, Star, ArrowRight, Globe, MapPin, Clock, PhoneCall, CheckCircle2,
} from 'lucide-react';
import { Button } from 'src/components/ui/Button';

export const revalidate = 10;

/* ─── Data Fetching ───────────────────────────────────────────────── */
async function getHomeData() {
  try {
    await connectDB();
    const categories = await Category.find({}).lean();
    const serializedCategories = JSON.parse(JSON.stringify(categories));

    const featuredProducts = await Product.find({ isFeatured: true })
      .populate('category')
      .limit(6)
      .lean();

    return {
      categories: serializedCategories,
      featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
    };
  } catch {
    return { categories: [], featuredProducts: [] };
  }
}

/* ─── Category Configurations ────────────────────────────────────── */
const categoryConfig: Record<string, {
  icon: React.ReactNode;
  accent: string;
  description: string;
  tag: string;
  gradient: string;
}> = {
  phones:      { icon: <Smartphone className="w-6 h-6" />, accent: 'text-blue-400 bg-blue-500/10 border-blue-500/20',   description: 'iPhone 16 Pro · Galaxy S25 · Pixel 9',         tag: 'Flagship Smartphones',   gradient: 'from-blue-500/8' },
  laptops:     { icon: <Laptop className="w-6 h-6" />,     accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', description: 'MacBook Pro M4 · ASUS ROG · XPS 15',   tag: 'Workstations & Gaming',  gradient: 'from-emerald-500/8' },
  desktops:    { icon: <Cpu className="w-6 h-6" />,        accent: 'text-purple-400 bg-purple-500/10 border-purple-500/20', description: 'Custom Build Rigs · Pro Workstations',     tag: 'Custom Desktop Systems', gradient: 'from-purple-500/8' },
  gaming:      { icon: <Gamepad2 className="w-6 h-6" />,   accent: 'text-rose-400 bg-rose-500/10 border-rose-500/20',   description: 'NVIDIA RTX 4090 · High-FPS Gaming',           tag: 'High-FPS Performance',   gradient: 'from-rose-500/8' },
  accessories: { icon: <Headphones className="w-6 h-6" />, accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20', description: 'AirPods Max · Sony ANC · Monitors',          tag: 'ANC Audio & Accessories', gradient: 'from-amber-500/8' },
  parts:       { icon: <Keyboard className="w-6 h-6" />,   accent: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',   description: 'DDR5 RAM · Gen4 NVMe · GPUs & PSUs',          tag: 'PC Upgrades & Parts',    gradient: 'from-cyan-500/8' },
};

/* ─── Brands Data ────────────────────────────────────────────────── */
const PHONE_BRANDS = [
  { name: 'Apple',    color: '#f5f5f7', weight: '800', spacing: '-0.04em' },
  { name: 'Samsung',  color: '#4A90D9', weight: '700', spacing: '-0.02em' },
  { name: 'Google',   color: '#4285F4', weight: '700', spacing: '-0.02em' },
  { name: 'Sony',     color: '#e5e5ea', weight: '800', spacing: '-0.03em' },
  { name: 'OnePlus',  color: '#F5010C', weight: '700', spacing: '-0.02em' },
  { name: 'Xiaomi',   color: '#FF6900', weight: '700', spacing: '-0.02em' },
  { name: 'Motorola', color: '#5B9BD5', weight: '700', spacing: '-0.01em' },
  { name: 'Nothing',  color: '#e5e5ea', weight: '700', spacing: '0em'     },
  { name: 'OPPO',     color: '#1D8348', weight: '800', spacing: '0.04em'  },
  { name: 'Huawei',   color: '#CF0A2C', weight: '700', spacing: '-0.01em' },
  { name: 'realme',   color: '#FEC90B', weight: '800', spacing: '-0.01em' },
  { name: 'vivo',     color: '#415FFF', weight: '700', spacing: '0em'     },
];

const PC_BRANDS = [
  { name: 'Intel',     color: '#0071C5', weight: '800', spacing: '-0.02em' },
  { name: 'AMD',       color: '#ED1C24', weight: '800', spacing: '0.03em'  },
  { name: 'NVIDIA',    color: '#76B900', weight: '800', spacing: '0.01em'  },
  { name: 'ASUS',      color: '#4A90D9', weight: '800', spacing: '0.04em'  },
  { name: 'Dell',      color: '#0076CE', weight: '700', spacing: '-0.01em' },
  { name: 'HP',        color: '#0096D6', weight: '800', spacing: '0.06em'  },
  { name: 'Lenovo',    color: '#E2231A', weight: '700', spacing: '-0.02em' },
  { name: 'MSI',       color: '#B90000', weight: '800', spacing: '0.04em'  },
  { name: 'Razer',     color: '#44D62C', weight: '700', spacing: '-0.01em' },
  { name: 'Corsair',   color: '#F9A01B', weight: '700', spacing: '-0.01em' },
  { name: 'Logitech',  color: '#00B8FC', weight: '700', spacing: '-0.01em' },
  { name: 'Kingston',  color: '#E31837', weight: '700', spacing: '-0.02em' },
  { name: 'LG',        color: '#A50034', weight: '800', spacing: '-0.01em' },
  { name: 'Microsoft', color: '#888',    weight: '600', spacing: '-0.01em' },
  { name: 'Acer',      color: '#83b81a', weight: '700', spacing: '-0.01em' },
];

/* ─── Ticker Items ───────────────────────────────────────────────── */
const TICKER_ITEMS = [
  { label: '✦ 100% LOCAL WARRANTY',           color: '#30d158' },
  { label: '✦ CASH ON DELIVERY (USD)',         color: '#2997ff' },
  { label: '✦ NATIONWIDE LEBANON SHIPPING',   color: '#a78bfa' },
  { label: '✦ WHATSAPP EXPERT SUPPORT 24/7',  color: '#f59e0b' },
  { label: '✦ 100% AUTHENTIC GUARANTEE',      color: '#f43f5e' },
  { label: '✦ CERTIFIED AUTHORIZED RESELLER', color: '#22d3ee' },
];

/* ─── Customer Testimonials ─────────────────────────────────────── */
const REVIEWS = [
  {
    name: 'Karim H.',
    location: 'Zahle, Lebanon',
    text: 'Ordered an iPhone 16 Pro Max in the morning and received it by 2 PM! Factory sealed with local warranty card. Excellent service.',
    rating: 5,
    tag: 'Verified Buyer',
    gradient: 'from-blue-600 to-cyan-500',
  },
  {
    name: 'Elie M.',
    location: 'Jounieh, Lebanon',
    text: 'Built my custom RTX 4090 gaming rig through Cedar Tech on WhatsApp. They stress-tested it and delivered it cleanly packaged to Jounieh.',
    rating: 5,
    tag: 'Custom Rig Build',
    gradient: 'from-purple-600 to-rose-500',
  },
  {
    name: 'Nour S.',
    location: 'Tripoli, Lebanon',
    text: 'Best prices for M4 MacBook Pro in Lebanon. Cash on Delivery was seamless, paid upon delivery after checking the box. 10/10 recommendation.',
    rating: 5,
    tag: 'Verified Buyer',
    gradient: 'from-emerald-600 to-teal-500',
  },
];

/* ─── UI Helpers ────────────────────────────────────────────────── */
function SectionHeading({
  eyebrow, title, subtitle, center = false, eyebrowClass = 'text-accent-bright',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
  eyebrowClass?: string;
}) {
  return (
    <div className={center ? 'text-center max-w-3xl mx-auto' : 'max-w-xl'}>
      {eyebrow && (
        <p className={`text-[11px] font-black uppercase tracking-[0.2em] mb-4 ${eyebrowClass}`}>
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-brand-text-primary mb-4 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-brand-text-secondary leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

/* ─── Brand Marquee Row ──────────────────────────────────────────── */
function BrandRow({ brands, direction = 'fwd' }: { brands: typeof PHONE_BRANDS; direction?: 'fwd' | 'rev' }) {
  const doubled = [...brands, ...brands];
  return (
    <div className="flex overflow-hidden py-2 relative group cursor-default">
      <div className={`flex w-max gap-4 animate-marquee-${direction} group-hover:[animation-play-state:paused]`}>
        {doubled.map((b, i) => (
          <Link
            key={i}
            href={`/products?search=${encodeURIComponent(b.name)}`}
            className="flex-shrink-0 flex items-center justify-center px-6 py-3 rounded-2xl bg-white/[0.04] border border-border-default hover:bg-white/[0.08] hover:border-border-strong hover:-translate-y-0.5 transition-all duration-200"
            title={`Browse ${b.name} products`}
          >
            <span style={{
              color: b.color === '#f5f5f7' || b.color === '#e5e5ea' ? 'rgba(245,245,247,0.85)' : b.color,
              fontWeight: b.weight,
              fontSize: '14px',
              letterSpacing: b.spacing,
            }}>
              {b.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN LANDING PAGE
═══════════════════════════════════════════════════════════════════ */
export default async function HomePage() {
  const { categories, featuredProducts } = await getHomeData();

  const displayCategories = categories.length > 0
    ? categories
    : ['phones', 'laptops', 'gaming', 'desktops', 'accessories', 'parts'].map((s) => ({
        _id: s, name: s.charAt(0).toUpperCase() + s.slice(1), slug: s, description: '',
      }));

  return (
    <div className="bg-brand-deep text-brand-text-primary min-h-screen overflow-x-hidden">

      {/* ════════════════════════════════════════════════════════
          1. CINEMATIC HERO
      ════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">

        {/* Ambient mesh gradient background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Deep radial glow — top center */}
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-30 animate-glow-pulse"
            style={{ background: 'radial-gradient(ellipse at center, #0077ED44 0%, transparent 70%)' }}
          />
          {/* Secondary glow — bottom right */}
          <div
            className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(ellipse at center, #a78bfa33 0%, transparent 70%)' }}
          />
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-28 pb-20 gap-8">

          {/* Live status badge */}
          <div className="animate-fade-up inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 border border-border-default text-xs font-semibold text-brand-text-secondary backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Cedar Tech · Official Electronics Hub · Kabelias, Bekaa
          </div>

          {/* Headline */}
          <div className="animate-fade-up delay-100 space-y-5 max-w-4xl">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.95] text-brand-text-primary">
              The Future of
              <br />
              <span
                className="inline-block"
                style={{
                  background: 'linear-gradient(135deg,#2997ff 0%,#0077ED 40%,#a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Tech Retail.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-brand-text-secondary max-w-2xl mx-auto leading-relaxed font-light">
              Flagship Smartphones · M4 MacBooks · Custom Gaming PCs · Components.
              <br className="hidden md:block" />
              <span className="text-brand-text-primary font-medium">1-Year Local Warranty</span> &amp;{' '}
              <span className="text-brand-text-primary font-medium">Cash on Delivery</span> across Lebanon.
            </p>
          </div>

          {/* Search */}
          <div className="animate-fade-up delay-200 w-full max-w-2xl space-y-4">
            <HeroSearch />

            {/* Search suggestion chips */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-medium text-brand-text-tertiary">Popular:</span>
              {[
                { label: 'iPhone 16 Pro', link: '/products?search=iPhone' },
                { label: 'Galaxy S25 Ultra', link: '/products?search=Galaxy' },
                { label: 'MacBook Pro M4', link: '/products?search=MacBook' },
                { label: 'RTX 4090 Rigs', link: '/products?search=RTX' },
                { label: 'Sony XM5', link: '/products?search=Sony' },
              ].map((chip) => (
                <Link
                  key={chip.label}
                  href={chip.link}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 border border-border-default hover:bg-white/10 hover:text-brand-text-primary transition-colors text-brand-text-secondary"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="animate-fade-up delay-300 flex flex-wrap items-center justify-center gap-4">
            <Link href="/products">
              <Button size="lg">
                Browse All Products
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <a
              href="https://wa.me/96179115521?text=Hello%20Cedar%20Tech%2C%20I%20have%20an%20inquiry%20about%20a%20product."
              target="_blank" rel="noopener noreferrer"
            >
              <Button variant="ghost" size="lg">
                <MessageSquare className="w-4 h-4 text-green-500 mr-1.5" />
                WhatsApp Support
              </Button>
            </a>
          </div>

          {/* Stats bar */}
          <div className="animate-fade-up delay-400 w-full max-w-3xl border-t border-border-default pt-10 mt-4 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Package className="w-5 h-5 text-accent-blue" />,    num: '10,000+', label: 'Delivered in Lebanon' },
              { icon: <Truck className="w-5 h-5 text-green-500" />,        num: '24h',      label: 'Bekaa Express Delivery' },
              { icon: <ShieldCheck className="w-5 h-5 text-purple-400" />, num: '1 Year',   label: 'Official Local Warranty' },
              { icon: <Star className="w-5 h-5 text-amber-400" />,         num: '4.9 / 5',  label: 'Customer Rating' },
            ].map((st, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-center">
                {st.icon}
                <span className="text-2xl font-black tracking-tight text-brand-text-primary">{st.num}</span>
                <span className="text-xs font-medium text-brand-text-tertiary">{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2. LIVE TRUST TICKER
      ════════════════════════════════════════════════════════ */}
      <div className="overflow-hidden bg-brand-surface py-4 border-y border-border-default relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-brand-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-brand-surface to-transparent z-10 pointer-events-none" />
        <div className="flex w-max animate-ticker-scroll hover:[animation-play-state:paused]">
          {[0, 1].map((ri) => (
            <span key={ri} className="flex items-center">
              {TICKER_ITEMS.map((item, i) => (
                <span
                  key={i}
                  className="mx-10 text-[11px] font-black tracking-[0.15em] uppercase"
                  style={{ color: item.color }}
                >
                  {item.label}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          3. FEATURED PRODUCTS — CINEMATIC CAROUSEL
      ════════════════════════════════════════════════════════ */}
      {featuredProducts.length > 0 && (
        <section className="w-full py-24 bg-brand-deep border-b border-border-default">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Section header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
              <SectionHeading
                eyebrow="Flagship Selection"
                title={<>Featured <span className="text-accent-blue">Products.</span></>}
                subtitle="Hand-picked flagship devices with local warranty and same-day Bekaa delivery."
                eyebrowClass="text-accent-blue"
              />
              <Link href="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-accent-blue hover:text-brand-text-primary transition-colors shrink-0">
                See full catalog <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Carousel */}
            <FeaturedCarousel products={featuredProducts} />

            {/* Also see — small product grid below carousel */}
            {featuredProducts.length > 1 && (
              <div className="mt-16">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-text-tertiary mb-6">Also Featured</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProducts.slice(0, 3).map((product: any) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════
          4. CATEGORY GRID
      ════════════════════════════════════════════════════════ */}
      <section className="w-full py-24 border-b border-border-default" style={{ background: '#050507' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
            <SectionHeading
              eyebrow="Hardware Ecosystem"
              title={<>Explore by <span className="text-purple-400">Category.</span></>}
              subtitle="Select a category to browse smartphones, laptops, custom workstations, and peripherals."
            />
            <Link href="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-purple-400 hover:text-brand-text-primary transition-colors shrink-0">
              View all products <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayCategories.map((cat: any) => {
              const cfg = categoryConfig[cat.slug] || {
                icon: <Cpu className="w-6 h-6" />, accent: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                description: 'Flagship gear', tag: 'Electronics', gradient: 'from-blue-500/8',
              };
              return (
                <Link
                  key={cat._id}
                  href={`/products?category=${cat.slug}`}
                  className="group relative flex flex-col justify-between p-7 rounded-3xl border border-border-default bg-brand-surface hover:bg-brand-elevated hover:border-border-strong transition-all duration-300 min-h-[200px] overflow-hidden"
                >
                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                  <div className="relative z-10 flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${cfg.accent}`}>
                      {cfg.icon}
                    </div>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 border border-border-default text-brand-text-tertiary group-hover:text-white group-hover:bg-white/10 transition-all duration-300">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  <div className="relative z-10 mt-8 space-y-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block border ${cfg.accent}`}>
                      {cfg.tag}
                    </span>
                    <h3 className="text-xl font-bold text-brand-text-primary tracking-tight">{cat.name}</h3>
                    <p className="text-xs text-brand-text-secondary">{cfg.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          5. AUTHORIZED BRAND PARTNERS
      ════════════════════════════════════════════════════════ */}
      <section className="w-full py-24 bg-brand-deep border-b border-border-default overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <SectionHeading
            center
            eyebrow="Official Brand Partners"
            title={<>Authorized Gear for <span className="text-cyan-400">Peak Performance.</span></>}
            subtitle="Click any brand to explore sealed, genuine products with full local service warranties."
          />
        </div>

        {/* Dual scrolling brand row */}
        <div className="relative w-full space-y-5 mb-20">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-brand-deep to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-brand-deep to-transparent z-10 pointer-events-none" />
          <BrandRow brands={PHONE_BRANDS} direction="fwd" />
          <BrandRow brands={PC_BRANDS} direction="rev" />
        </div>

        {/* 3 Trust Pillars */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <ShieldCheck className="w-7 h-7" />,
                color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                title: 'Official Local Warranty',
                body: 'Every item is 100% genuine, factory sealed, and includes 1-year local service warranty coverage in Lebanon.',
              },
              {
                icon: <Zap className="w-7 h-7" />,
                color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                title: 'Bekaa Express & COD',
                body: 'Fast 24h delivery across the Bekaa valley. Pay USD cash upon arrival after inspecting your sealed box.',
              },
              {
                icon: <Globe className="w-7 h-7" />,
                color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
                title: 'Certified Authenticity',
                body: 'We source directly from authorized brand distributors. Genuine serial numbers & verifiable factory seals.',
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl flex flex-col gap-5 bg-brand-surface border border-border-default hover:bg-brand-elevated hover:border-border-strong transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${feat.color} group-hover:scale-110 transition-transform duration-300`}>
                  {feat.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-brand-text-primary tracking-tight">{feat.title}</h3>
                  <p className="text-sm text-brand-text-secondary leading-relaxed">{feat.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          6. CUSTOMER REVIEWS
      ════════════════════════════════════════════════════════ */}
      <section className="w-full py-24 border-b border-border-default" style={{ background: '#050507' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <SectionHeading
              center
              eyebrow="Verified Customer Reviews"
              eyebrowClass="text-amber-400"
              title={<>Trusted Across <span className="text-amber-400">Lebanon.</span></>}
              subtitle="Real feedback from tech buyers, gamers, and professionals across Lebanon."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((rev, i) => (
              <div
                key={i}
                className="relative p-7 rounded-3xl flex flex-col justify-between gap-7 bg-brand-surface border border-border-default hover:border-border-strong transition-all duration-300 overflow-hidden"
              >
                {/* Subtle corner gradient */}
                <div
                  className={`absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-10 bg-gradient-to-br ${rev.gradient} pointer-events-none`}
                />

                <div className="relative space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {[...Array(rev.rating)].map((_, s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {rev.tag}
                    </span>
                  </div>
                  <p className="text-sm text-brand-text-primary leading-relaxed">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>

                <div className="relative flex items-center gap-3 pt-5 border-t border-border-default">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br ${rev.gradient} shrink-0`}>
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-text-primary">{rev.name}</p>
                    <p className="text-xs text-brand-text-tertiary">{rev.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          7. SHOWROOM & CONCIERGE
      ════════════════════════════════════════════════════════ */}
      <section className="relative w-full py-24 bg-brand-deep border-b border-border-default overflow-hidden">

        {/* Background glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #0077ED 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left — CTA text */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-border-default text-xs font-semibold text-brand-text-secondary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              Live Tech Concierge &amp; Showroom
            </div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-brand-text-primary leading-tight">
              Need Expert Advice<br />
              or a{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg,#2997ff,#0077ED)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Custom Quote?
              </span>
            </h2>

            <p className="text-base text-brand-text-secondary max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Our hardware specialists are ready to help you choose the right device, build a custom PC, or answer technical compatibility questions — in real time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="https://wa.me/96179115521?text=Hello%20Cedar%20Tech%2C%20I%20need%20help%20choosing%20a%20product."
                target="_blank" rel="noopener noreferrer"
              >
                <Button size="lg" className="!bg-green-500 hover:!bg-green-600 shadow-[0_8px_24px_rgba(34,197,94,0.25)]">
                  <MessageSquare className="w-5 h-5 fill-white mr-2" />
                  Chat on WhatsApp (+961 79 115 521)
                </Button>
              </a>
            </div>
          </div>

          {/* Right — Info card */}
          <div className="p-8 md:p-10 rounded-3xl bg-brand-surface border border-border-default backdrop-blur-sm space-y-7">
            <h3 className="text-xl font-bold text-brand-text-primary flex items-center gap-3">
              <MapPin className="w-6 h-6 text-accent-blue" />
              <span>Kabelias Showroom &amp; Dispatch Hub</span>
            </h3>

            <div className="space-y-5">
              {[
                { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: 'Main Highway, Kabelias, Bekaa, Lebanon' },
                { icon: <Clock className="w-5 h-5" />, label: 'Opening Hours', value: 'Monday – Saturday: 9:00 AM – 8:00 PM' },
                { icon: <PhoneCall className="w-5 h-5" />, label: 'Phone Support', value: '+961 79 115 521 / +961 1 340 900' },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-white/5 border border-border-default text-brand-text-secondary shrink-0">
                    {row.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-text-primary text-sm mb-0.5">{row.label}</p>
                    <p className="text-sm text-brand-text-secondary leading-relaxed">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-5 border-t border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-medium">
              <span className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg w-max border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                Showroom Open Today
              </span>
              <span className="text-brand-text-tertiary">USD Cash on Delivery (COD) Only</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          8. FAQ
      ════════════════════════════════════════════════════════ */}
      <FaqSection />

    </div>
  );
}
