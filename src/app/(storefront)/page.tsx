import React from 'react';
import connectDB from 'src/lib/db';
import Product from 'src/models/Product';
import Category from 'src/models/Category';
import HomeClient from 'src/components/HomeClient';

export const revalidate = 10;

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

export default async function HomePage() {
  const { categories, featuredProducts } = await getHomeData();

  return (
    <HomeClient
      categories={categories}
      featuredProducts={featuredProducts}
    />
  );
}
