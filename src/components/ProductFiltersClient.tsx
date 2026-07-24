'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface ProductFiltersClientProps {
  categories: Category[];
  brands: string[];
  activeFilters: {
    category: string;
    brand: string;
    minPrice: string;
    maxPrice: string;
    inStockOnly: string;
    sort: string;
    search: string;
  };
}

export default function ProductFiltersClient({
  categories,
  brands,
  activeFilters,
}: ProductFiltersClientProps) {
  const router = useRouter();

  const [minPrice, setMinPrice] = useState(activeFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(activeFilters.maxPrice);

  useEffect(() => {
    setMinPrice(activeFilters.minPrice);
    setMaxPrice(activeFilters.maxPrice);
  }, [activeFilters.minPrice, activeFilters.maxPrice]);

  const updateFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams();
    
    const current = {
      category: activeFilters.category,
      brand: activeFilters.brand,
      minPrice: minPrice,
      maxPrice: maxPrice,
      inStockOnly: activeFilters.inStockOnly,
      sort: activeFilters.sort,
      search: activeFilters.search,
      ...newParams,
    };

    if (current.category) params.set('category', current.category);
    if (current.brand) params.set('brand', current.brand);
    if (current.minPrice) params.set('minPrice', current.minPrice);
    if (current.maxPrice) params.set('maxPrice', current.maxPrice);
    if (current.inStockOnly === 'true') params.set('inStockOnly', 'true');
    if (current.sort && current.sort !== 'latest') params.set('sort', current.sort);
    if (current.search) params.set('search', current.search);

    router.push(`/products?${params.toString()}`);
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ minPrice, maxPrice });
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    router.push('/products');
  };

  return (
    <div className="rounded-2xl p-6 space-y-6 sticky top-24 bg-brand-surface border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-white">
          <SlidersHorizontal className="w-4 h-4 text-accent-bright" />
          <h2 className="text-sm font-bold uppercase tracking-wider">Filters</h2>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-brand-text-secondary hover:text-white flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort Option */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider">
          Sort By
        </label>
        <select
          value={activeFilters.sort}
          onChange={(e) => updateFilters({ sort: e.target.value })}
          className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-3 outline-none text-sm transition-all focus:border-accent-bright focus:ring-1 focus:ring-accent-bright"
        >
          <option value="latest" className="bg-brand-deep text-white">Latest Arrivals</option>
          <option value="price_asc" className="bg-brand-deep text-white">Price: Low to High</option>
          <option value="price_desc" className="bg-brand-deep text-white">Price: High to Low</option>
        </select>
      </div>

      {/* Categories Filter */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider">
          Category
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <button
            onClick={() => updateFilters({ category: '' })}
            className={`w-full text-left text-sm px-4 py-2.5 rounded-xl transition-colors font-medium ${
              !activeFilters.category
                ? 'bg-accent-blue/20 text-accent-bright border border-accent-blue/30'
                : 'text-brand-text-secondary hover:bg-white/5 border border-transparent'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateFilters({ category: cat.slug })}
              className={`w-full text-left text-sm px-4 py-2.5 rounded-xl transition-colors font-medium ${
                activeFilters.category === cat.slug
                  ? 'bg-accent-blue/20 text-accent-bright border border-accent-blue/30'
                  : 'text-brand-text-secondary hover:bg-white/5 border border-transparent'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brands Filter */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider">
          Brand
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <button
            onClick={() => updateFilters({ brand: '' })}
            className={`w-full text-left text-sm px-4 py-2.5 rounded-xl transition-colors font-medium ${
              !activeFilters.brand
                ? 'bg-accent-blue/20 text-accent-bright border border-accent-blue/30'
                : 'text-brand-text-secondary hover:bg-white/5 border border-transparent'
            }`}
          >
            All Brands
          </button>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => updateFilters({ brand: brand })}
              className={`w-full text-left text-sm px-4 py-2.5 rounded-xl transition-colors font-medium ${
                activeFilters.brand === brand
                  ? 'bg-accent-blue/20 text-accent-bright border border-accent-blue/30'
                  : 'text-brand-text-secondary hover:bg-white/5 border border-transparent'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider">
          Price Range ($)
        </label>
        <form onSubmit={handlePriceApply} className="space-y-3">
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="Min"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full text-sm"
            />
            <span className="text-sm text-brand-text-tertiary">to</span>
            <Input
              type="number"
              placeholder="Max"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full text-sm"
            />
          </div>
          <Button
            type="submit"
            fullWidth
            size="sm"
          >
            Apply Price
          </Button>
        </form>
      </div>

      {/* Availability Toggle */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider">
          In Stock Only
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={activeFilters.inStockOnly === 'true'}
            onChange={(e) => updateFilters({ inStockOnly: e.target.checked ? 'true' : 'false' })}
            className="sr-only peer"
          />
          <div className="w-10 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-blue"></div>
        </label>
      </div>

    </div>
  );
}
