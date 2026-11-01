import { NextResponse } from 'next/server';
import connectDB from 'src/lib/db';
import Product from 'src/models/Product';
import { getUserFromRequest } from 'src/lib/auth';

// Helper to sanitize specification keys so dots do not break MongoDB/Mongoose
function sanitizeSpecs(specs: any): Record<string, string> {
  if (!specs || typeof specs !== 'object') return {};
  const cleaned: Record<string, string> = {};
  for (const [key, val] of Object.entries(specs)) {
    const safeKey = key.replace(/\./g, '•').trim();
    if (safeKey && val !== undefined && val !== null) {
      cleaned[safeKey] = String(val);
    }
  }
  return cleaned;
}

// Helper to generate a slug from product name
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const products = await Product.find({}).populate('category').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await req.json();
    const { name, brand, modelName, description, shortDescription, price, stock, images, category, specifications, warrantyInfo, isFeatured, availabilityStatus, translations } = body;

    if (!name || !brand || !description || price === undefined || stock === undefined || !category) {
      return NextResponse.json({ error: 'Required fields missing: name, brand, description, price, stock, category' }, { status: 400 });
    }

    // Generate unique slug
    let baseSlug = slugify(name);
    let uniqueSlug = baseSlug;
    let slugExists = await Product.findOne({ slug: uniqueSlug });
    let count = 1;
    while (slugExists) {
      uniqueSlug = `${baseSlug}-${count}`;
      slugExists = await Product.findOne({ slug: uniqueSlug });
      count++;
    }

    const product = await Product.create({
      name,
      slug: uniqueSlug,
      brand,
      modelName,
      description,
      shortDescription,
      price: Number(price),
      stock: Number(stock),
      images: images || [],
      category,
      specifications: sanitizeSpecs(specifications),
      warrantyInfo,
      isFeatured: !!isFeatured,
      availabilityStatus: availabilityStatus || 'in_stock',
      translations: translations || {},
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error('Admin Create Product Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
