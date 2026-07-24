import { NextResponse } from 'next/server';
import connectDB from 'src/lib/db';
import Order from 'src/models/Order';
import { getUserFromRequest } from 'src/lib/auth';

export async function GET(req: Request) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
