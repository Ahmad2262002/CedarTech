'use client';

import React from 'react';
import ProductCard from 'src/components/ProductCard';
import ProductFiltersClient from 'src/components/ProductFiltersClient';
import { useTranslation } from 'src/context/LanguageContext';

interface ProductsClientProps {
  products: any[];
  categories: any[];
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

export default function ProductsClient({
  products,
  categories,
  brands,
  activeFilters,
}: ProductsClientProps) {
  const { t } = useTranslation();

  const getTitle = () => {
    if (activeFilters.search) {
      return `${t('nav.search', 'Results for')} "${activeFilters.search}"`;
    }
    if (activeFilters.category) {
      return `${activeFilters.category.toUpperCase()} ${t('nav.products', 'Catalog')}`;
    }
    return t('nav.products', 'Store Catalog');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Page Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {getTitle()}
        </h1>
        <p className="text-sm text-brand-text-secondary mt-2">
          {t('product.showing', `Showing ${products.length} item(s) with official local warranty`)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <ProductFiltersClient
            categories={categories}
            brands={brands}
            activeFilters={activeFilters}
          />
        </aside>

        {/* Product Cards Grid */}
        <main className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 rounded-3xl p-8 bg-brand-surface border border-white/10">
              <span className="text-4xl">🔍</span>
              <h3 className="text-white font-bold text-lg mt-4">{t('product.noProductsFound', 'No products found')}</h3>
              <p className="text-sm mt-2 max-w-sm text-brand-text-secondary">
                {t('product.tryAdjusting', 'We couldn\'t find any products matching your criteria. Try adjusting your filters or search term.')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>

    </div>
  );
}
