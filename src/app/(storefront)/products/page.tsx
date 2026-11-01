import React from 'react';
import connectDB from 'src/lib/db';
import Product from 'src/models/Product';
import Category from 'src/models/Category';
import ProductsClient from 'src/components/ProductsClient';

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
    <ProductsClient
      products={serializedProducts}
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
  );
}
