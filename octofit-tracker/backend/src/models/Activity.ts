import { model, Schema } from 'mongoose';

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      required: true,
      enum: ['running', 'walking', 'strength-training', 'cycling', 'swimming', 'other'],
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    calories: { type: Number, min: 0, default: 0 },
    date: { type: Date, required: true, default: Date.now },
    notes: { type: String, trim: true, maxlength: 1000, default: '' },
  },
  { timestamps: true },
);

export default model('Activity', activitySchema);
