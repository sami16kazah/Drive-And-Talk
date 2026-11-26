import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICourse extends Document {
  title: {
    en: string;
    nl: string;
  };
  slug: string;
  description: {
    en: string;
    nl: string;
  };
  /** Category value, configured in the CMS (Website Inhoud > Algemeen > Categories). */
  category: string;
  syllabus?: {
    en: string[];
    nl: string[];
  };
  price: number;
  imageUrl?: string;
  cloudinaryPublicId?: string;
  isActive: boolean;
  createdAt: Date;
}

const CourseSchema: Schema<ICourse> = new Schema(
  {
    title: {
      en: { type: String, required: true },
      nl: { type: String, required: true },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      en: { type: String, required: true },
      nl: { type: String, required: true },
    },
    category: {
      type: String,
      required: true,
      default: 'Dutch',
    },
    syllabus: {
      en: { type: [String], default: [] },
      nl: { type: [String], default: [] },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    cloudinaryPublicId: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
