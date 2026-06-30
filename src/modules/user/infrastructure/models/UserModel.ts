import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const schema = new Schema<UserDocument>({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model<UserDocument>('User', schema);
