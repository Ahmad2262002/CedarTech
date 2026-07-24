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
        storeName: 'Cedar Tech',
        contactPhone: '+961 79 115 521',
        whatsAppNumber: '96179115521',
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
