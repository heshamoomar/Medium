"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import OnClickUserName from "../components/onClickUserName";

export default function PostClient({ user }: { user: any }) {
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!title.trim() || !content.trim()) {
      setError("⚠️ Title and Content are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id: user._id, // 👈 make sure user._id comes from your DB sync
          title,
          shortDesc,
          image,
          content,
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError("❌ Failed to create post. Try again.");
      }
    } catch (err) {
      setError("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Top Navigation */}
      <header className="w-full flex items-center justify-between bg-white shadow px-8 py-4">
        {/* LEFT: User info */}
        <div className="flex items-center gap-3">
          {user?.picture ? (
            <a href="/dashboard">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.picture}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            </a>
          ) : (
            <span className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-400">
              👤
            </span>
          )}
          <OnClickUserName userAgent={user} />

          <a
            href="/dashboard"
            className="rounded-xl border px-4 py-2 text-sm hover:text-blue-600 focus:text-blue-600 transition"
          >
            Dashboard
          </a>
        </div>

        {/* RIGHT: Logout */}
        <LogoutLink className="rounded-xl border px-4 py-2 text-sm hover:text-blue-600 focus:text-blue-600 transition">
          Logout
        </LogoutLink>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            ✍️ Create a New Post
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Post Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="text"
              placeholder="Short Description"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              placeholder="Write your content here... *"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border rounded-lg px-4 py-2 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {error && <p className="text-red-500 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`rounded-lg px-4 py-2 font-semibold transition text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Publishing..." : "🚀 Publish Post"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
