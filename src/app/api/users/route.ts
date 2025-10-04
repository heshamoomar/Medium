// medium/src/app/api/users/route.ts
// bulk fetch users by IDs

"use server";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import mongoose from "mongoose";
import User from "../models/User";

// GET /api/users?ids=123,456,789
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json(
        { error: "No ids provided" },
        { status: 400 }
      );
    }

    const ids = idsParam
      .split(",")
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "No valid user IDs" },
        { status: 400 }
      );
    }

    const users = await User.find({ _id: { $in: ids } }).lean();

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
