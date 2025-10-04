import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound } from "next/navigation";
import OnClickUserName from "./components/onClickUserName";
import { syncUser } from "../app/lib/syncUser";
import HomeFeed from "./HomeFeed";

export default async function Home() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();
  await syncUser(); // Sync user with our DB to make sure we have their latest info (e.g., last login time)
  const authenticated = await isAuthenticated();


  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Top ribbon */}
      <header className="w-full flex items-center justify-between bg-white shadow px-8 py-4">
      {/* LEFT: User avatar + name + dashboard*/}
      <div className="flex items-center gap-3">
        {authenticated && user ? (
        <>
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          {user?.picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <a href="/dashboard">
            <img
              src={user.picture}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            </a>
          ) : (
            <span className="text-2xl text-gray-400">👤</span>
          )}
          </div>
          <OnClickUserName userAgent={user} />
          <a
          href="/dashboard"
          className="rounded-xl border px-4 py-2 text-center hover:text-blue-600 focus:text-blue-600 transition"
          >
          Dashboard
          </a>
        </>
        ) : (
        <span className="text-gray-500 font-medium">
          Welcome, Guest!
        </span>
        )}
      </div>

      {/* CENTER: Post (only if logged in) */}
      <div className="flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2">
        {(authenticated && user) ? (
          <>
            <a
              href="/post"
              className="rounded-xl border px-4 py-2 text-center hover:text-blue-600 focus:text-blue-600 transition"
            >
              Post
            </a>
          </>
        ) : (
          <LoginLink className="rounded-xl border px-4 py-2 mx-2 text-center hover:text-blue-600 focus:text-blue-600 transition">
            Post
          </LoginLink>
        )}
      </div>

      {/* RIGHT: Auth buttons */}
      <div className="flex items-center gap-4">
        {authenticated && user ? (
        <LogoutLink className="rounded-xl border px-4 py-2 text-center hover:text-blue-600 focus:text-blue-600 transition">
          Logout
        </LogoutLink>
        ) : (
        <>
          <LoginLink className="rounded-xl border px-4 py-2 mx-2 text-center hover:text-blue-600 focus:text-blue-600 transition">
          Login
          </LoginLink>
          <RegisterLink className="rounded-xl border px-4 py-2 mx-2 text-center hover:text-blue-600 focus:text-blue-600 transition">
          Register
          </RegisterLink>
        </>
        )}
      </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center">
      <HomeFeed />
      </main>
    </div>
  );
}
