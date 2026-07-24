import { NextResponse } from 'next/server';
import connectDB from 'src/lib/db';
import Category from 'src/models/Category';
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
    const dbCategory = await Category.findById(id);

    if (!dbCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (body.name !== undefined) dbCategory.name = body.name;
    if (body.description !== undefined) dbCategory.description = body.description;
    if (body.imageUrl !== undefined) dbCategory.imageUrl = body.imageUrl;

    await dbCategory.save();
    return NextResponse.json({ success: true, category: dbCategory });
  } catch (error: any) {
    console.error('Admin Update Category Error:', error);
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
    const dbCategory = await Category.findByIdAndDelete(id);

    if (!dbCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Admin Delete Category Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
