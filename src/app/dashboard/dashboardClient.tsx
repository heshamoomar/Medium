"use client";
import { useEffect, useState } from "react";

  // Format date like Facebook: "2 hours ago", "Yesterday", etc.
  const getRelativeTime = (dateString: string) => {
      const now = new Date();
      const postDate = new Date(dateString);
      const diffMs = now.getTime() - postDate.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffSec < 60) return "Just now";
      if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
      if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
      if (diffDay === 1) return "Yesterday";
      if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
      
      return postDate.toLocaleDateString();
  };

export default function UserPosts({ userId }: { userId: string }) {
  const [posts, setPosts] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/users/${userId}/posts`, {
          cache: "no-store", // always fetch latest posts
        });
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("❌ Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    // Skeleton loader
    return (
      <div className="flex flex-col space-y-4 w-full max-w-2xl">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white shadow rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return <p className="text-gray-500 italic">No posts yet.</p>;
  }

  return (
    <>
      <div className="flex w-full max-w-2xl flex-col space-y-6 mt-8">
        
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post: any) => {

            return (
        <a
          key={post._id}
          href={`/post/${post._id}`}
          className="bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-3 border border-gray-100 hover:shadow-xl transition hover:bg-gray-50"
          style={{ textDecoration: "none" }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-blue-700">{post.title}</h3>
            <span className="text-xs text-gray-400">
              {getRelativeTime(post.createdAt)}
            </span>
          </div>
          {post.description && (
            <p className="text-gray-600">{post.description}</p>
          )}
          {post.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.image}
              alt={post.title || "Post image"}
              className="mt-2 rounded-lg max-h-80 object-cover border"
            />
          )}
          <p className="text-gray-700">{post.content}</p>
        </a>
            );
          })
        ) : (
          <p className="text-gray-500 italic">No posts yet.</p>
        )}
      </div>
    </>
  );
}
