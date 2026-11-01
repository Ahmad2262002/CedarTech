import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IStoreSettings extends Document {
  storeName: string;
  contactPhone: string;
  whatsAppNumber: string;
  deliveryFee: number;
  currencySymbol: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  enabledPaymentMethods: {
    cod: boolean;
  };
}

const StoreSettingsSchema = new Schema<IStoreSettings>(
  {
    storeName: { type: String, required: true, default: 'Agha Tech plus' },
    contactPhone: { type: String, required: true, default: '+961 76 743 718' },
    whatsAppNumber: { type: String, required: true, default: '96176743718' },
    deliveryFee: { type: Number, required: true, default: 5 },
    currencySymbol: { type: String, required: true, default: '$' },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
    enabledPaymentMethods: {
      cod: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default models.StoreSettings || model<IStoreSettings>('StoreSettings', StoreSettingsSchema);
