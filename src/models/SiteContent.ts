import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Headless CMS storage. One document per content scope:
 *  - "nl" / "en": website texts per language (next-intl messages)
 *  - "global":    language independent content (contact, images, theme, categories, emails)
 */
export interface ISiteContent extends Document {
  key: string;
  data: Record<string, any>;
  updatedAt: Date;
}

const SiteContentSchema: Schema<ISiteContent> = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false }
);

export const SiteContent: Model<ISiteContent> =
  mongoose.models.SiteContent || mongoose.model<ISiteContent>('SiteContent', SiteContentSchema);
