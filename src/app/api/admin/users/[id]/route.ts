import { NextResponse } from 'next/server';
import connectDB from 'src/lib/db';
import User from 'src/models/User';
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
    const { status } = await req.json();

    if (!status || !['active', 'blocked'].includes(status)) {
      return NextResponse.json({ error: 'Invalid user status value' }, { status: 400 });
    }

    const customer = await User.findById(id);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    customer.status = status;
    await customer.save();

    return NextResponse.json({ success: true, customer: { id: customer._id, name: customer.name, status: customer.status } });
  } catch (error: any) {
    console.error('Admin Update User Status Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
