// medium/src/app/api/users/[id]/posts/route.ts
// get all posts by a specific user
// GET /api/users/:id/posts
// returns array of posts by that user
// each post includes id, title, content, createdAt, updatedAt, imageUrl, etc.
// no authentication needed to view posts
// anyone can view posts by any user
// used by /post/[id]/page.tsx to show post owner info

"use server";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb"; 
import Post from "../../../models/Post"; 
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = await params; // userId
    console.log("Fetching posts for user:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Find all posts by userId, newest first
    const posts = await Post.find({ owner_id: id })
      .sort({ createdAt: -1 })
      .lean();

    if (!posts || posts.length === 0) {
      return NextResponse.json(
        { message: "No posts found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(posts, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching user posts:", err);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
