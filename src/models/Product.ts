import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  brand: string;
  modelName?: string;
  description: string;
  shortDescription?: string;
  price: number;
  stock: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  specifications: Record<string, string>;
  warrantyInfo?: string;
  isFeatured: boolean;
  availabilityStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    brand: { type: String, required: true },
    modelName: { type: String },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: { type: [String], default: [] },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    specifications: { type: Schema.Types.Mixed, default: {} },
    warrantyInfo: { type: String },
    isFeatured: { type: Boolean, default: false },
    availabilityStatus: {
      type: String,
      enum: ['in_stock', 'low_stock', 'out_of_stock'],
      default: 'in_stock',
    },
  },
  { timestamps: true }
);

export default models.Product || model<IProduct>('Product', ProductSchema);
