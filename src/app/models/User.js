import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  auth_id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  family_name: String,
  given_name: String,
  picture: { type: String, trim: true },
  lastLogin: { type: Date }
});

UserSchema.index({ name: 1 }); // For searching by name

export default mongoose.models.User || mongoose.model("User", UserSchema);