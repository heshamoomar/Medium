"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import OnClickUserName from "../components/onClickUserName";

export default function PostClient({ user }: { user: any }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("owner_id", user._id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);

    if (imageFile) {
      formData.append("file", imageFile);
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      console.log("✅ Post created with ID:", data._id);
      
      router.push("/post/" + [data._id]);
    } else {
      setError(data.error || "Aww, Failed to create post 😥");
    }
  } catch (err) {
    console.error("Error creating post:", err);
    setError("Something went wrong 😥");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    setImageURL(imageFile? URL.createObjectURL(imageFile) : "");
  }, [imageFile]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* Top Navigation */}
      <header className="w-full flex items-center justify-between bg-white shadow px-8 py-4">
        <div className="flex items-center gap-3">
          {user?.picture ? (
            <a href="/dashboard">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.picture}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
              />
            </a>
          ) : (
            <span className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-400">
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

        <LogoutLink className="rounded-xl border px-4 py-2 text-sm hover:text-blue-600 focus:text-blue-600 transition">
          Logout
        </LogoutLink>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            ✍️ Create a New Post
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="Post Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded-lg px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="text"
              placeholder="Short Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded-lg px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Image Upload */}
            <input
              type="file"
              placeholder="Upload an image"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="border rounded-lg px-5 py-3 text-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            
              {imageURL ? (
                    <img
                      src={imageURL}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  
                ) : (
                  <span className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-400">
                    🖼️
                  </span>
                )}  
            
            <textarea
              placeholder="Write your content here... *"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border rounded-lg px-5 py-4 text-lg min-h-[250px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {error && <p className="text-red-500 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`rounded-lg px-6 py-3 text-lg font-semibold transition text-white ${
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
