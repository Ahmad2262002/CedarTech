import { NextResponse } from 'next/server';
import connectDB from 'src/lib/db';
import StoreSettings from 'src/models/StoreSettings';
import { getUserFromRequest } from 'src/lib/auth';

export async function PUT(req: Request) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await req.json();
    let settings = await StoreSettings.findOne();

    if (!settings) {
      settings = new StoreSettings({});
    }

    const fields = ['storeName', 'contactPhone', 'whatsAppNumber', 'deliveryFee', 'currencySymbol', 'socialLinks', 'enabledPaymentMethods'];
    for (const field of fields) {
      if (body[field] !== undefined) {
        settings[field] = body[field];
      }
    }

    await settings.save();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Admin Update Settings Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
