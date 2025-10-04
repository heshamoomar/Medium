'use client';
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

export default function HomeFeed() {
  const [posts, setPosts] = useState<any[] | null>(null);
  const [users, setUsers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      try {
        // 1. Fetch posts
        const res = await fetch(`/api/posts`);
        const data = await res.json();
        setPosts(data);

        // 2. Collect unique uploader IDs
        const ids = [...new Set(data.map((p: any) => p.owner_id))];
        if (ids.length > 0) {
          // 3. Fetch all users in one call (bulk fetch)
          const userRes = await fetch(`/api/users?ids=${ids.join(",")}`);
          const usersData = await userRes.json();
          console.log("Fetched users data:", usersData);
          
          // --- DEBUG: Log fetched users ---
          usersData.forEach((u: any) => {
            console.log(`User ID: ${u._id}, Name: ${u.name}`);
          });

          // 4. Map users by ID
          const userMap: Record<string, any> = {};
          usersData.forEach((u: any) => {
            userMap[u._id] = u; // adjust key if your user model uses `id` instead of `_id`
          });
          setUsers(userMap);
        }
      } catch (err) {
        console.error("❌ Failed to fetch posts or users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsAndUsers();
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

  // -- UI --
  var PostOwerPfP_onclick = '/'; // default

  return (
    <div className="flex w-full max-w-2xl flex-col space-y-6 mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4 justify-self-start">
        Feed
      </h2>
      {posts.map((post: any) => {
        const uploader = users[post.owner_id]; // look up user from map by owner_id 

        // string | null
        PostOwerPfP_onclick = '/user/'+post.owner_id; // default // زبون فقط 

        return (
          <div
            key={post._id}
            className="bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-3 border border-gray-100 hover:shadow-xl transition hover:bg-gray-50"
          >
            {/* Uploader info */}
            {uploader && (
              <div className="flex items-center gap-3 mb-2">
                <a href={PostOwerPfP_onclick}>
                  <img
                    src={uploader.picture || "👤"}
                    alt={uploader.given_name + " " + uploader.family_name || "User"}
                    className="w-10 h-10 rounded-full border"
                  />
                </a>
                <div>
                  <p className="font-semibold text-gray-800">{uploader.given_name + " " + uploader.family_name || "User"}</p>
                  <p className="text-xs text-gray-400">
                    {getRelativeTime(post.createdAt)}
                  </p>
                </div>
              </div>
            )}

            {/* Post title and content */}
            <a
              href={`/post/${post._id}`}
              style={{ textDecoration: "none" }}
              className="block"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-blue-700">{post.title}</h3>
              </div>
              {post.description && (
                <p className="text-gray-600">{post.description}</p>
              )}
                {post.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.image}
                  alt={post.title || "Post image"}
                  className="mt-2 rounded-lg w-full h-80 object-cover border"
                  style={{ display: "block" }}
                />
                )}
              <p className="text-gray-700">{post.content}</p>
            </a>
          </div>
        );
      })}
    </div>
  );
}
