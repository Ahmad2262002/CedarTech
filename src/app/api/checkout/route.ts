import { NextResponse } from 'next/server';
import connectDB from 'src/lib/db';
import Order from 'src/models/Order';
import Product from 'src/models/Product';
import { getUserFromRequest } from 'src/lib/auth';

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);
    const orderData = await req.json();

    const { customerDetails, shippingAddress, paymentMethod, paymentDetails, items, subtotal, deliveryFee, total } = orderData;

    // Server-side validation
    if (!customerDetails?.name || !customerDetails?.phone || !customerDetails?.email) {
      return NextResponse.json({ error: 'Customer contact details are required' }, { status: 400 });
    }

    if (!shippingAddress?.city || !shippingAddress?.region || !shippingAddress?.streetAddress) {
      return NextResponse.json({ error: 'Complete shipping address is required' }, { status: 400 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
    }

    if (paymentMethod !== 'cod') {
      return NextResponse.json({ error: 'Cash on Delivery (COD) is the only accepted payment method' }, { status: 400 });
    }

    // Verify stock and update product counts
    const updatedItems = [];
    for (const item of items) {
      const dbProduct = await Product.findById(item._id);
      
      if (!dbProduct) {
        return NextResponse.json({ error: `Product "${item.name}" was not found` }, { status: 404 });
      }

      if (dbProduct.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${item.name}". Only ${dbProduct.stock} left.` },
          { status: 400 }
        );
      }

      // Deduct stock
      dbProduct.stock -= item.quantity;
      if (dbProduct.stock === 0) {
        dbProduct.availabilityStatus = 'out_of_stock';
      } else if (dbProduct.stock <= 3) {
        dbProduct.availabilityStatus = 'low_stock';
      }
      
      await dbProduct.save();

      updatedItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        price: dbProduct.price,
        quantity: item.quantity,
        image: dbProduct.images?.[0] || '/images/placeholder.jpg',
      });
    }

    // Create the order
    const order = await Order.create({
      user: user ? user.id : undefined,
      customerDetails,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      items: updatedItems,
      subtotal,
      deliveryFee,
      total,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      order: {
        id: order._id,
        total: order.total,
        paymentMethod: order.paymentMethod,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
