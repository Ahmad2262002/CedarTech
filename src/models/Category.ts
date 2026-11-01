import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface ICategoryTranslation {
  name?: string;
  description?: string;
}

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  translations?: Record<string, ICategoryTranslation>;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    imageUrl: { type: String },
    translations: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default models.Category || model<ICategory>('Category', CategorySchema);
