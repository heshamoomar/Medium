import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import OnClickUserName from "./components/onClickUserName";

export default async function Home() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();
  const authenticated = await isAuthenticated();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Top ribbon */}
      <header className="w-full flex items-center justify-between bg-white shadow px-8 py-4">
        {/* LEFT: User avatar + name + dashboard*/}
        <div className="flex items-center gap-3">
          {authenticated && user ? (
            <>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                {user?.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <a href="/dashboard">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
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
          {authenticated && user && (
            <>
              <a
                href="/post"
                className="rounded-xl border px-4 py-2 text-center hover:text-blue-600 focus:text-blue-600 transition"
              >
                Post
              </a>
            </>
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
      <main className="flex flex-1 w-full flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-2xl flex-col items-center justify-center rounded-lg bg-white shadow-lg px-8 py-10">
          <h1 className="text-6xl font-bold mb-4 text-gray-800">
            Welcome to Medium!
          </h1>
          <p className="mt-3 text-2xl text-gray-700">
            Get started by logging in or registering
          </p>
        </div>
      </main>
    </div>
  );
}
