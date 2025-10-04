import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import UserPosts from "./dashboardClient"; // client component to display user posts
// import { requireUser }from "../lib/auth"; // utility function to require user auth and get user info

import { syncUser } from "../lib/syncUser";
import { redirect } from "next/navigation";

export default async function Dashboard() {

  const user = await syncUser(); // fetch and sync user from Kinde to MongoDB to keep updated
  
  if (!user) {
    redirect("/"); // not logged in
  }
  
  console.log("DB User:", user);

  const plainUser = JSON.parse(JSON.stringify(user)); // to remove Mongoose document methods
  
  const userId= plainUser._id; // needed because UserPosts is a Client Component and cannot receive Mongoose document directly
  // (could also use user.toObject() if it were available)

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Top strip with Logout button */}
      <header className="w-full flex items-center justify-between bg-white shadow px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            {user?.picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.picture} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <span className="text-2xl text-gray-400">👤</span>
            )}
          </div>
          <span className="font-semibold text-gray-700">
            {user?.given_name || user?.email || "User"}
          </span>
                        <a
                href="/"
                className="rounded-xl border px-4 py-2 text-center hover:text-blue-600 focus:text-blue-600 transition"
              >
                Explore
              </a>

        </div>

        {/* CENTER: Post */}
        <div className="flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2">
              <a
                href="/post"
                className="rounded-xl border px-4 py-2 text-center hover:text-blue-600 focus:text-blue-600 transition"
              >
                Post
              </a>
        </div>


        <LogoutLink className="rounded-xl border px-4 py-2 text-center hover:text-blue-600 focus:text-blue-600 transition">
          Logout
        </LogoutLink>
      </header>

      {/* Main dashboard content */}
      <main className="flex flex-1 w-full flex-col items-center px-8 py-10">

            {/* User Header */}
        <div className="flex items-center gap-4 border-b pb-4">
      {user?.picture ? (
      <img
        src={user.picture}
        alt={user.given_name + " " + user.family_name || "User"}
        className="w-16 h-16 rounded-full object-cover shadow"
      />
      ) : (
      <span className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-400 shadow">
        👤
      </span>
      )}
      <div>
      <h1 className="text-xl font-semibold">
        {user.given_name + " " + user.family_name || "Unnamed User"}
      </h1>
      <p className="text-gray-500 text-sm">
        {user.email || "No email provided"}
      </p>
                        
      </div>
    </div>
        {/* Separated Posts fetching & showing skeleton and shwoing posts to another page 
          because showing a skeleton until posts are fetched requires React hooks which are client components. */}
        
        {/* User Posts */}
        <UserPosts userId={userId} /> {/* pass userId to fetch posts for that user */}


      </main>    
    </div>
  );
}
