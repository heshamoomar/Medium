"use server";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Post from "../../models/Post.js";
import cloudinary from "../../../lib/cloudinary";
import mongoose from "mongoose";
import { error } from "console";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = context.params;
    console.log("Fetching post with ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const post = await Post.findById(id).lean();
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching post:", err);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
