import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { verifyToken } from 'src/lib/auth';
import { LayoutDashboard, ShoppingBag, Layers, ShoppingCart, Users, Settings } from 'lucide-react';
import AdminLogoutButton from 'src/components/admin/AdminLogoutButton';

export const revalidate = 0; // Dynamic layout

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') return null;

  return decoded;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await checkAdminAuth();

  if (!admin) {
    redirect('/admin/login');
  }

  const navItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4 text-accent-bright" /> },
    { label: 'Products', href: '/admin/products', icon: <ShoppingBag className="w-4 h-4 text-accent-bright" /> },
    { label: 'Categories', href: '/admin/categories', icon: <Layers className="w-4 h-4 text-accent-bright" /> },
    { label: 'Orders', href: '/admin/orders', icon: <ShoppingCart className="w-4 h-4 text-accent-bright" /> },
    { label: 'Customers', href: '/admin/users', icon: <Users className="w-4 h-4 text-accent-bright" /> },
    { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4 text-accent-bright" /> },
  ];

  return (
    <div className="min-h-screen flex bg-brand-deep text-brand-text-primary selection:bg-accent-blue/30">
      
      {/* Sidebar navigation */}
      <aside className="w-64 border-r border-border-default bg-brand-surface flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="flex flex-col">
          {/* Logo header */}
          <div className="h-20 flex items-center px-6 border-b border-border-default">
            <Link href="/" className="flex items-center gap-2.5 group select-none">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-transform group-hover:scale-105">
                <path d="M16 2L4 14H10L4 24H28L22 14H28L16 2Z" fill="url(#cedar-grad-admin)" />
                <rect x="14" y="24" width="4" height="6" fill="#52525b" />
                <defs>
                  <linearGradient id="cedar-grad-admin" x1="16" y1="2" x2="16" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffffff" />
                    <stop offset="1" stopColor="#a1a1aa" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex flex-col">
                <span className="font-black text-xs tracking-tight text-brand-text-primary uppercase">
                  Agha Tech<span className="text-accent-bright"> plus</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-brand-text-tertiary font-mono">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Links list */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 text-brand-text-secondary hover:text-brand-text-primary hover:bg-white/5 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all group"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Admin profile & logout */}
        <div className="p-4 border-t border-border-default">
          <div className="bg-brand-elevated border border-border-default p-3.5 rounded-2xl flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-brand-text-primary font-bold text-xs truncate leading-none">{admin.name}</p>
              <p className="text-[10px] text-brand-text-tertiary truncate mt-1 font-mono">System Admin</p>
            </div>
            <AdminLogoutButton />
          </div>
        </div>

      </aside>

      {/* Main panel container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header */}
        <header className="h-16 border-b border-border-default px-6 flex items-center justify-between md:hidden bg-brand-surface">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L4 14H10L4 24H28L22 14H28L16 2Z" fill="url(#cedar-grad-admin-mob)" />
              <rect x="14" y="24" width="4" height="6" fill="#52525b" />
              <defs>
                <linearGradient id="cedar-grad-admin-mob" x1="16" y1="2" x2="16" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffffff" />
                  <stop offset="1" stopColor="#a1a1aa" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-extrabold tracking-tight text-brand-text-primary text-xs uppercase">Agha Tech plus Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <AdminLogoutButton />
          </div>
        </header>

        {/* Page children contents */}
        <main className="p-6 md:p-10 pb-28 md:pb-10 flex-1 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* iOS-Style Floating Admin Dock (Mobile Only) */}
      <div className="md:hidden fixed bottom-5 left-4 right-4 z-50 bg-[#111113]/85 backdrop-blur-xl border border-white/10 rounded-[28px] py-2 px-3 shadow-[0_16px_50px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 text-[#8e8e93] active:scale-90 transition-all hover:text-white"
            >
              <div className="p-2.5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                {item.icon}
              </div>
              <span className="text-[8px] font-black tracking-wider uppercase scale-90">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>


    </div>
  );
}
