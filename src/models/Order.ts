import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder extends Document {
  user?: mongoose.Types.ObjectId;
  customerDetails: {
    name: string;
    phone: string;
    email: string;
  };
  shippingAddress: {
    city: string;
    region: string;
    streetAddress: string;
    details?: string;
  };
  paymentMethod: 'cod';
  paymentDetails?: {
    notes?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
});

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    customerDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    shippingAddress: {
      city: { type: String, required: true },
      region: { type: String, required: true },
      streetAddress: { type: String, required: true },
      details: { type: String },
    },
    paymentMethod: {
      type: String,
      enum: ['cod'],
      default: 'cod',
    },
    paymentDetails: {
      notes: { type: String },
    },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default models.Order || model<IOrder>('Order', OrderSchema);
