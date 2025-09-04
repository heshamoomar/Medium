import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    owner_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String, trim: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

// Indexes for faster queries
PostSchema.index({ owner_id: 1, createdAt: -1 }); // posts by user, newest first
PostSchema.index({ title: "text", description: "text", content: "text" }); // full-text search

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
