'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from 'src/lib/context/AuthContext';
import { useCart } from 'src/lib/context/CartContext';
import { Search, ShoppingBag, User, LogOut, LayoutDashboard, X, ChevronDown, Home, Grid } from 'lucide-react';


function NavbarContent() {
  const { user, logout, setShowLoginModal } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Store',         href: '/products' },
    { label: 'Smartphones',   href: '/products?category=cell-phones' },
    { label: 'Laptops',       href: '/products?category=laptops' },
    { label: 'Custom PCs',    href: '/products?category=desktops-rigs' },
    { label: 'Gaming Rigs',   href: '/products?category=gaming-gear' },
    { label: 'Audio & ANC',   href: '/products?category=audio-anc' },
    { label: 'Components',    href: '/products?category=components-parts' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-brand-surface/90 backdrop-blur-md border-b border-border-default'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group select-none shrink-0"
            >
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-transform group-hover:scale-105">
                <path d="M16 2L4 14H10L4 24H28L22 14H28L16 2Z" fill="url(#cedar-grad-nav)" />
                <rect x="14" y="24" width="4" height="6" fill="#52525b" />
                <defs>
                  <linearGradient id="cedar-grad-nav" x1="16" y1="2" x2="16" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffffff" />
                    <stop offset="1" stopColor="#a1a1aa" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-brand-text-primary font-black text-lg tracking-tight">
                CEDAR<span className="text-accent-bright">TECH</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center justify-center flex-1 gap-5 xl:gap-8 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[12px] font-medium text-brand-text-secondary hover:text-brand-text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-full text-brand-text-primary hover:bg-white/5 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full text-brand-text-primary hover:bg-white/5 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-blue text-[10px] font-bold text-white shadow-[0_0_8px_rgba(0,113,227,0.5)]">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User */}
              {user ? (
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-2.5 rounded-full text-brand-text-primary hover:bg-white/5 transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden bg-brand-surface border border-border-default shadow-xl z-50">
                      <div className="px-4 py-3 border-b border-border-default">
                        <p className="text-xs text-brand-text-secondary">Signed in as</p>
                        <p className="text-sm font-semibold text-brand-text-primary truncate">{user.email}</p>
                      </div>
                      <div className="py-2">
                        {user.role === 'admin' && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-brand-text-primary hover:bg-white/5 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-accent-bright" />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => { setUserDropdownOpen(false); logout(); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="p-2.5 rounded-full text-brand-text-primary hover:bg-white/5 transition-colors"
                  aria-label="Sign In"
                >
                  <User className="w-5 h-5" />
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-full text-brand-text-primary hover:bg-white/5 transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : (
                  <svg viewBox="0 0 18 12" className="w-[18px] h-[12px]" fill="currentColor">
                    <rect y="0" width="18" height="1.5" rx="1" />
                    <rect y="5.25" width="18" height="1.5" rx="1" />
                    <rect y="10.5" width="18" height="1.5" rx="1" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Search Overlay ── */}
        {searchOpen && (
          <div className="w-full py-4 px-4 bg-brand-surface/90 backdrop-blur-md border-t border-border-default absolute top-full left-0 z-40 shadow-lg">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-tertiary" />
              <input
                type="text"
                autoFocus
                placeholder="Search phones, laptops, gaming gear…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl text-sm outline-none bg-white/5 border border-border-default text-brand-text-primary focus:bg-white focus:border-accent-bright focus:ring-1 focus:ring-accent-bright transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-tertiary hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* ── Mobile Menu ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-brand-deep border-t border-white/10 absolute top-full left-0 w-full z-40 shadow-2xl">
            <div className="px-4 py-4 space-y-2">
              <form onSubmit={handleSearchSubmit} className="relative pb-4 border-b border-white/10">
                <Search className="absolute left-4 top-1/2 mt-1.5 -translate-y-1/2 w-4 h-4 text-brand-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none bg-white/5 border border-white/10 text-white focus:border-accent-bright"
                />
              </form>
              
              <div className="py-2 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-medium text-brand-text-primary hover:bg-white/10 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <button
                    onClick={() => { setMobileMenuOpen(false); setShowLoginModal(true); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-base font-bold text-accent-bright hover:bg-white/10 transition-colors mt-2"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </header>

      {/* ── iOS-Style Bottom Navigation Tab Bar (Mobile Only) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0c]/85 backdrop-blur-lg border-t border-white/10 px-6 py-2.5 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {/* Home */}
          <Link
            href="/"
            onClick={() => {
              setMobileMenuOpen(false);
              setSearchOpen(false);
            }}
            className="flex flex-col items-center gap-0.5 text-[#8e8e93] active:scale-95 hover:text-white transition-all"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold tracking-wide">Home</span>
          </Link>

          {/* Catalog */}
          <Link
            href="/products"
            onClick={() => {
              setMobileMenuOpen(false);
              setSearchOpen(false);
            }}
            className="flex flex-col items-center gap-0.5 text-[#8e8e93] active:scale-95 hover:text-white transition-all"
          >
            <Grid className="w-5 h-5" />
            <span className="text-[10px] font-semibold tracking-wide">Catalog</span>
          </Link>

          {/* Search Toggle */}
          <button
            onClick={() => {
              setSearchOpen(!searchOpen);
              setMobileMenuOpen(false);
            }}
            className={`flex flex-col items-center gap-0.5 active:scale-95 transition-all ${
              searchOpen ? 'text-accent-bright' : 'text-[#8e8e93] hover:text-white'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-semibold tracking-wide">Search</span>
          </button>

          {/* Cart */}
          <button
            onClick={() => {
              setIsCartOpen(true);
              setMobileMenuOpen(false);
              setSearchOpen(false);
            }}
            className="relative flex flex-col items-center gap-0.5 text-[#8e8e93] active:scale-95 hover:text-white transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent-bright text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
            <span className="text-[10px] font-semibold tracking-wide">Cart</span>
          </button>

          {/* Profile / Account */}
          {user ? (
            <Link
              href={user.role === 'admin' ? '/admin/dashboard' : '/products'}
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(false);
              }}
              className="flex flex-col items-center gap-0.5 text-[#8e8e93] active:scale-95 hover:text-white transition-all"
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-semibold tracking-wide">
                {user.role === 'admin' ? 'Admin' : 'Profile'}
              </span>
            </Link>
          ) : (
            <button
              onClick={() => {
                setShowLoginModal(true);
                setMobileMenuOpen(false);
                setSearchOpen(false);
              }}
              className="flex flex-col items-center gap-0.5 text-[#8e8e93] active:scale-95 hover:text-white transition-all"
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-semibold tracking-wide">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}
