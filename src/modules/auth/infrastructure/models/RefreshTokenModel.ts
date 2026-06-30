import mongoose, { Schema, Document } from 'mongoose';

export interface RefreshTokenDocument extends Document {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revoked: boolean;
  createdAt: Date;
}

const schema = new Schema<RefreshTokenDocument>({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  revoked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const RefreshTokenModel = mongoose.model<RefreshTokenDocument>(
  'RefreshToken',
  schema,
);
