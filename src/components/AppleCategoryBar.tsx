'use client';

import React from 'react';
import Link from 'next/link';
import { Smartphone, Laptop, Cpu, Gamepad2, Headphones, Keyboard } from 'lucide-react';

const CATEGORY_ITEMS = [
  { label: 'Smartphones', category: 'cell-phones',      icon: <Smartphone className="w-4 h-4" /> },
  { label: 'Laptops',     category: 'laptops',          icon: <Laptop className="w-4 h-4" /> },
  { label: 'Custom PCs',  category: 'desktops-rigs',    icon: <Cpu className="w-4 h-4" /> },
  { label: 'Gaming Rigs', category: 'gaming-gear',      icon: <Gamepad2 className="w-4 h-4" /> },
  { label: 'Audio & ANC', category: 'audio-anc',        icon: <Headphones className="w-4 h-4" /> },
  { label: 'Components',  category: 'components-parts', icon: <Keyboard className="w-4 h-4" /> },
];

export default function AppleCategoryBar() {
  return (
    <div className="w-full bg-brand-deep/80 backdrop-blur-sm border-b border-white/10 py-3 overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start sm:justify-center gap-3 min-w-max">
        {CATEGORY_ITEMS.map((item) => (
          <Link
            key={item.category}
            href={`/products?category=${item.category}`}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 transition-all duration-200 hover:bg-white/10 hover:border-white/20"
          >
            <span className="text-accent-bright group-hover:scale-110 transition-transform">
              {item.icon}
            </span>
            <span className="text-sm font-medium text-brand-text-primary group-hover:text-white transition-colors">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
