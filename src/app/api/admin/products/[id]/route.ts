import { NextResponse } from 'next/server';
import connectDB from 'src/lib/db';
import Product from 'src/models/Product';
import { getUserFromRequest } from 'src/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const dbProduct = await Product.findById(id);

    if (!dbProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Update fields
    const fields = [
      'name', 'brand', 'modelName', 'description', 'shortDescription',
      'price', 'stock', 'images', 'category', 'specifications',
      'warrantyInfo', 'isFeatured', 'availabilityStatus'
    ];

    for (const field of fields) {
      if (body[field] !== undefined) {
        if (field === 'price' || field === 'stock') {
          dbProduct[field] = Number(body[field]);
        } else {
          dbProduct[field] = body[field];
        }
      }
    }

    await dbProduct.save();
    return NextResponse.json({ success: true, product: dbProduct });
  } catch (error: any) {
    console.error('Admin Update Product Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const { id } = await params;
    const dbProduct = await Product.findByIdAndDelete(id);

    if (!dbProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Admin Delete Product Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
