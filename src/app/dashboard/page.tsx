import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
// import { requireUser }from "../lib/auth"; // utility function to require user auth and get user info

import { syncUser } from "../lib/syncUser";
import { redirect } from "next/navigation";

export default async function Dashboard() {

//  const user = await requireUser(); // Redirects to "/" if not authenticated


  const user = await syncUser();

  if (!user) {
    redirect("/"); // not logged in
  }
  console.log("DB User:", user);

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
      <main className="flex flex-1 w-full flex-col items-center justify-center px-8 py-10">
        <div className="flex w-full max-w-2xl flex-col items-center justify-center rounded-lg bg-white shadow-lg px-8 py-10">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Dashboard
          </h1>
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-700">
              Welcome, {user?.given_name || user?.email || "User"}!
            </h2>
            <p className="text-gray-500 mt-2">{user?.email}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
