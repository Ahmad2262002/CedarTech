import { NextResponse } from 'next/server';
import connectDB from 'src/lib/db';
import Category from 'src/models/Category';
import { getUserFromRequest } from 'src/lib/auth';

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, categories });
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

    const { name, description, imageUrl } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    // Generate unique slug
    let baseSlug = slugify(name);
    let uniqueSlug = baseSlug;
    let slugExists = await Category.findOne({ slug: uniqueSlug });
    let count = 1;
    while (slugExists) {
      uniqueSlug = `${baseSlug}-${count}`;
      slugExists = await Category.findOne({ slug: uniqueSlug });
      count++;
    }

    const category = await Category.create({
      name,
      slug: uniqueSlug,
      description,
      imageUrl: imageUrl || '',
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    console.error('Admin Create Category Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
