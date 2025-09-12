"use server";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Post from "../../models/Post.js";
import cloudinary from "../../../lib/cloudinary";
import mongoose from "mongoose";
import { error } from "console";
import User from "../../models/User";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    console.log("Fetching post owner with ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid post owner ID" }, { status: 400 });
    }

    const user = await User.findById(id).lean();
    if (!user) {
      console.error("❌ Error finding post owner:", id);
      return;
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching post owner:", err);
    return;
  }
}
