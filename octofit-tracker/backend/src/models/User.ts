import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    name: { type: String, required: true, trim: true },
    bio: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { timestamps: true },
);

export default model('User', userSchema);
