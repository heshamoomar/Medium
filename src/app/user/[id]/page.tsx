import { notFound } from "next/dist/client/components/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import OnClickUserName from "../../components/onClickUserName";


// Get user session info
const { getUser, isAuthenticated } = getKindeServerSession();
const user = await getUser();
const authenticated = await isAuthenticated();
console.log("User:", user);
console.log("Authenticated:", authenticated);

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  // --- Fetch User ---
  const fetched_user = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!fetched_user.ok) {
    console.error("Failed to fetch user:", fetched_user.statusText);
     return notFound();
  }


  const user = await fetched_user.json();
  console.log("User:", user);

  const lastLoginDate = user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "N/A";
  const lastLoginTime = user.lastLogin ? new Date(user.lastLogin).toLocaleTimeString() : "N/A";

  var lastLoginDisplay = user.lastLogin ? `${lastLoginDate} at ${lastLoginTime}` : "N/A";

  var isToday = false;
  if(lastLoginDate === new Date().toLocaleDateString())
    isToday = true;

    if(isToday){
        lastLoginDisplay = `Today at ${lastLoginTime}`;
    }

  // --- UI ---
  return (
    <>
        {/* Top ribbon */}
    <header className="w-full flex items-center justify-between bg-white shadow px-8 py-4">
      {/* LEFT: User avatar + name + dashboard */}
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
          <span className="text-gray-500 font-medium">Welcome, Guest!</span>
        )}
      </div>

      {/* CENTER: Post (only if logged in) */}
      <div className="flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2">
        
          <a
            href="/"
            className="rounded-xl border px-4 py-2 text-center hover:text-blue-600 focus:text-blue-600 transition"
          >
            Explore
          </a>
        
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
        {/* Main Content */}    
    <div className="min-h-[calc(100vh-80px)] flex items-start justify-center px-4 py-12">
  <main className="max-w-lg w-full p-8 bg-white rounded-2xl shadow space-y-6">
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

    {/* Extra details */}
    <section className="text-gray-700 space-y-2">
      {user.given_name && (
        <p>
          <strong>First Name:</strong> {user.given_name}
        </p>
      )}
      {user.family_name && (
        <p>
          <strong>Last Name:</strong> {user.family_name}
        </p>
      )}
      {user.lastLogin && (
        <p>
          <strong>Last active:</strong> {lastLoginDisplay}
        </p>
      )}
      {user.createdAt && (
        <p className="text-sm text-gray-500">
          Joined on {new Date(user.createdAt).toLocaleDateString()}
        </p>
      )}
    </section>
  </main>
</div>

    </>
  );
}
