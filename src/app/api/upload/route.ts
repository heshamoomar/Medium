import { NextResponse } from "next/server";
import cloudinary from "../../lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "posts" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    return NextResponse.json(uploadResponse, { status: 200 });
  } catch (err) {
    console.error("❌ Upload error:", err);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
