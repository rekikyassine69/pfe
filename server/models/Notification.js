import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  type: { type: String, required: true },
  titre: String,
  message: { type: String, required: true },
  dateCreation: { type: Date, default: Date.now },
  estLue: { type: Boolean, default: false },
  lien: String,
  priorite: { type: String, enum: ['haute', 'normale', 'basse'], default: 'normale' }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema, 'notifications');
