import React from 'react';
import connectDB from 'src/lib/db';
import Product from 'src/models/Product';
import Category from 'src/models/Category';
import ProductCard from 'src/components/ProductCard';
import ProductFiltersClient from 'src/components/ProductFiltersClient';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    inStockOnly?: string;
    sort?: string;
    search?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  await connectDB();
  
  const params = await searchParams;
  
  const categorySlug = params.category || '';
  const brandParam = params.brand || '';
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : null;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : null;
  const inStockOnly = params.inStockOnly === 'true';
  const sortOption = params.sort || 'latest';
  const searchQuery = params.search || '';

  const query: any = {};

  if (categorySlug) {
    const categoryDoc = await Category.findOne({ slug: categorySlug });
    if (categoryDoc) {
      query.category = categoryDoc._id;
    } else {
      query.category = '000000000000000000000000';
    }
  }

  if (searchQuery) {
    query.$or = [
      { name: { $regex: searchQuery, $options: 'i' } },
      { brand: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } },
    ];
  }

  if (brandParam) {
    query.brand = brandParam;
  }

  if (minPrice !== null || maxPrice !== null) {
    query.price = {};
    if (minPrice !== null) query.price.$gte = minPrice;
    if (maxPrice !== null) query.price.$lte = maxPrice;
  }

  if (inStockOnly) {
    query.stock = { $gt: 0 };
  }

  let sortQuery: any = { createdAt: -1 };
  if (sortOption === 'price_asc') {
    sortQuery = { price: 1 };
  } else if (sortOption === 'price_desc') {
    sortQuery = { price: -1 };
  }

  const products = await Product.find(query)
    .populate('category')
    .sort(sortQuery)
    .lean();

  const dbCategories = await Category.find({}).lean();
  const dbBrands = await Product.distinct('brand');

  const serializedProducts = JSON.parse(JSON.stringify(products));
  const serializedCategories = JSON.parse(JSON.stringify(dbCategories));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Page Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {searchQuery ? `Results for "${searchQuery}"` : categorySlug ? `${categorySlug.toUpperCase()} Catalog` : 'Store Catalog'}
        </h1>
        <p className="text-sm text-brand-text-secondary mt-2">
          Showing {serializedProducts.length} {serializedProducts.length === 1 ? 'product' : 'products'} with official local warranty
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <ProductFiltersClient
            categories={serializedCategories}
            brands={dbBrands}
            activeFilters={{
              category: categorySlug,
              brand: brandParam,
              minPrice: params.minPrice || '',
              maxPrice: params.maxPrice || '',
              inStockOnly: params.inStockOnly || 'false',
              sort: sortOption,
              search: searchQuery,
            }}
          />
        </aside>

        {/* Product Cards Grid */}
        <main className="lg:col-span-3">
          {serializedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 rounded-3xl p-8 bg-brand-surface border border-white/10">
              <span className="text-4xl">🔍</span>
              <h3 className="text-white font-bold text-lg mt-4">No products found</h3>
              <p className="text-sm mt-2 max-w-sm text-brand-text-secondary">
                We couldn&apos;t find any products matching your criteria. Try adjusting your filters or search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {serializedProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>

    </div>
  );
}
