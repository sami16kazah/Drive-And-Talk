import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReplyHistory {
  message: string;
  subject: string;
  sentAt: Date;
}

export interface IEnrollmentContact extends Document {
  type: 'contact' | 'enrollment';
  courseId?: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
  status: 'pending' | 'replied' | 'archived';
  replyHistory: IReplyHistory[];
  createdAt: Date;
}

const EnrollmentContactSchema: Schema<IEnrollmentContact> = new Schema(
  {
    type: {
      type: String,
      enum: ['contact', 'enrollment'],
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'replied', 'archived'],
      default: 'pending',
    },
    replyHistory: [
      {
        message: { type: String, required: true },
        subject: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const EnrollmentContact: Model<IEnrollmentContact> =
  mongoose.models.EnrollmentContact ||
  mongoose.model<IEnrollmentContact>('EnrollmentContact', EnrollmentContactSchema);
