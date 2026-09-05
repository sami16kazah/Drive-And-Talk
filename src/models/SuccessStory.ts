import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISuccessStory extends Document {
  studentName: string;
  courseTaken: string;
  story: {
    en: string;
    nl: string;
  };
  imageUrl?: string;
  cloudinaryPublicId?: string;
  date: Date;
}

const SuccessStorySchema: Schema<ISuccessStory> = new Schema(
  {
    studentName: {
      type: String,
      required: true,
    },
    courseTaken: {
      type: String,
      required: true,
    },
    story: {
      en: { type: String, required: true },
      nl: { type: String, required: true },
    },
    imageUrl: {
      type: String,
      default: '',
    },
    cloudinaryPublicId: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const SuccessStory: Model<ISuccessStory> =
  mongoose.models.SuccessStory ||
  mongoose.model<ISuccessStory>('SuccessStory', SuccessStorySchema);
