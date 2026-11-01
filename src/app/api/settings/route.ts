import { NextResponse } from 'next/server';
import connectDB from 'src/lib/db';
import StoreSettings from 'src/models/StoreSettings';

export async function GET() {
  try {
    await connectDB();
    let settings = await StoreSettings.findOne();
    
    // Create defaults if not found
    if (!settings) {
      settings = await StoreSettings.create({
        storeName: 'Agha Tech plus',
        contactPhone: '+961 76 743 718',
        whatsAppNumber: '96176743718',
        deliveryFee: 5,
        currencySymbol: '$',
        socialLinks: {
          facebook: 'https://facebook.com',
          instagram: 'https://instagram.com',
        },
        enabledPaymentMethods: {
          cod: true,
        },
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Settings API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
