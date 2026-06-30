import mongoose, { Schema, Document } from 'mongoose';
import { USER_ROLE, UserRole } from '@/shared/constants/userRole.js';

export interface UserDocument extends Document {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

const schema = new Schema<UserDocument>({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: [USER_ROLE.ADMIN, USER_ROLE.MEMBER, USER_ROLE.GUEST],
    default: USER_ROLE.MEMBER,
  },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model<UserDocument>('User', schema);
