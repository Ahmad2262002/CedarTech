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
    storeName: { type: String, required: true, default: 'Cedar Tech' },
    contactPhone: { type: String, required: true, default: '+961 79 115 521' },
    whatsAppNumber: { type: String, required: true, default: '96179115521' },
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
