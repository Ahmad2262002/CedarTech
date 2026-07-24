'use client';

import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/Button';

export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto relative group">
      <div className="relative flex items-center rounded-full p-1.5 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 focus-within:!border-accent-bright focus-within:!bg-white/10 shadow-lg">
        <Search className="w-5 h-5 ml-4 shrink-0 text-brand-text-tertiary group-focus-within:text-accent-bright transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search iPhone 16, M4 MacBook, RTX 4090..."
          className="w-full bg-transparent px-4 py-3 text-base text-white outline-none placeholder:text-brand-text-tertiary"
        />
        <Button
          type="submit"
          size="md"
          className="rounded-full px-6"
        >
          <span>Search</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
