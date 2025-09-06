import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import Post from "../models/Post.js";
import cloudinary from "../../lib/cloudinary";
import mongoose from "mongoose";
import { error } from "console";

export async function POST(req: Request) {
  try {
    await connectDB();

    // Read FormData (file + text fields)
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const owner_id = formData.get("owner_id") as string;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and Content are required" }, { status: 400 });
    }

    let imageUrl = "";

    // Upload to Cloudinary if file exists
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResponse = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "posts" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      imageUrl = uploadResponse.secure_url;
    }

    // Save post in MongoDB
    const newPost = await Post.create({
      owner_id,
      title,
      description,
      content,
      image: imageUrl,
    });

    const plainPost = JSON.parse(JSON.stringify(newPost));

    return NextResponse.json(plainPost, { status: 201 });
  } catch (err) {
    console.error("❌ Error creating post:", err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}


