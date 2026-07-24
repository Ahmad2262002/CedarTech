import { NextResponse } from 'next/server';
import connectDB from 'src/lib/db';
import User from 'src/models/User';
import { getUserFromRequest } from 'src/lib/auth';

export async function GET(req: Request) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    // Return customers only
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, customers });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
