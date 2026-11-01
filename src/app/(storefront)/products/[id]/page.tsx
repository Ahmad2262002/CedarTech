import React from 'react';
import connectDB from 'src/lib/db';
import Product from 'src/models/Product';
import ProductCard from 'src/components/ProductCard';
import ProductDetailsClient from 'src/components/ProductDetailsClient';
import Link from 'next/link';
import { ArrowLeft, TableProperties, FileText } from 'lucide-react';
import { Button } from 'src/components/ui/Button';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

import mongoose from 'mongoose';

async function getProductData(id: string) {
  try {
    await connectDB();
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const product = await Product.findOne(isObjectId ? { _id: id } : { slug: id })
      .populate('category')
      .lean();
    if (!product) return null;

    const related = await Product.find({
      category: (product.category as any)._id,
      _id: { $ne: product._id },
    })
      .limit(4)
      .lean();

    return {
      product: JSON.parse(JSON.stringify(product)),
      related: JSON.parse(JSON.stringify(related)),
    };
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getProductData(id);

  if (!data) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="max-w-md mx-auto bg-brand-surface rounded-3xl p-10 space-y-4 border border-white/10">
          <span className="text-5xl">⚠️</span>
          <h2 className="text-white font-extrabold text-2xl">Product Not Found</h2>
          <p className="text-sm text-brand-text-secondary">
            The requested electronic item might have been removed, or the link is incorrect.
          </p>
          <Link href="/products" className="mt-4 inline-block">
            <Button>Back to Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { product, related } = data;
  const specifications = product.specifications || {};
  const specsEntries = Object.entries(specifications);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      
      {/* Back button */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-white text-brand-text-secondary"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store Catalog</span>
        </Link>
      </div>

      {/* Main product presentation */}
      <ProductDetailsClient product={product} />

      {/* Description & Technical Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-10 border-t border-white/10">
        
        {/* Description */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <FileText className="w-5 h-5 text-accent-bright" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">Product Overview</h2>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-line text-brand-text-secondary">
            {product.description}
          </p>
        </div>

        {/* Technical Specs Table */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <TableProperties className="w-5 h-5 text-accent-bright" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">Technical Specifications</h2>
          </div>
          
          {specsEntries.length === 0 ? (
            <p className="text-sm italic text-brand-text-tertiary">No detailed specifications listed.</p>
          ) : (
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-brand-surface">
              <table className="w-full text-left border-collapse text-sm">
                <tbody>
                  {specsEntries.map(([key, value]: any, idx) => (
                    <tr
                      key={key}
                      className={`border-b border-white/10 last:border-none ${idx % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`}
                    >
                      <td className="p-4 font-semibold text-brand-text-secondary w-1/3 border-r border-white/10 uppercase tracking-wide text-xs">
                        {key}
                      </td>
                      <td className="p-4 text-white font-medium">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-white/10">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Related Electronics</h2>
            <p className="text-sm mt-1 text-brand-text-secondary">Customers also viewed these items</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((prod: any) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
