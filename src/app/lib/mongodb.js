import mongoose from "mongoose";

let isConnected = false; // Track connection state

export async function connectDB() {
  if (isConnected) {
    console.log("⚡ Using existing MongoDB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/medium-clone", {
      dbName: "medium-clone",
    });

    isConnected = conn.connections[0].readyState === 1; // 1 = connected
    console.log("✅ MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
