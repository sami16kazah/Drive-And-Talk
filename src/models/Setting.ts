import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  adminNotificationEmail: string;
  senderEmail: string;
  senderName: string;
}

const SettingSchema: Schema<ISetting> = new Schema(
  {
    key: {
      type: String,
      default: 'site_settings',
      unique: true,
    },
    adminNotificationEmail: {
      type: String,
      default: 'info@drivetalk.nl',
    },
    senderEmail: {
      type: String,
      default: 'info@drivetalk.nl',
    },
    senderName: {
      type: String,
      default: 'Drive&Talk Academy',
    },
  },
  {
    timestamps: true,
  }
);

export const Setting: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);
