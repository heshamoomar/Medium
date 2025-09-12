import { notFound } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import OnClickUserName from "../../components/onClickUserName";


export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

    // Get user session info
    const { getUser, isAuthenticated } = getKindeServerSession();
    const user = await getUser();
    const authenticated = await isAuthenticated();
    console.log("User:", user);
    console.log("Authenticated:", authenticated);

  // --- Fetch Post ---
  const fetched_post = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!fetched_post.ok) {
    console.error("Failed to fetch post:", fetched_post.statusText);
    return notFound();
  }

  const post = await fetched_post.json();

  // --- Fetch Post Owner ---
  const fetched_owner = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${post.owner_id}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }
  );

  if (!fetched_owner.ok) {
    console.error("Failed to fetch post owner:", fetched_owner.statusText);
    return notFound();
  }

  const owner = await fetched_owner.json();
  console.log("Post Owner:", owner);

    // string | null
    var PostOwerPfP_onclick = '/user/'+post.owner_id; // default // زبون فقط 

    console.log("PostOwerPfP_onclick:", PostOwerPfP_onclick);

    if(user?.id==owner.auth_id && authenticated)  // own post // go to dashboard // زبون وصاحب مكان
      {
      PostOwerPfP_onclick = '/dashboard';
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

    {/* Full-page flexbox for vertical centering */}
    <div className="min-h-[calc(100vh-80px)] flex items-start justify-center px-4 py-12">
      <main className="max-w-3xl w-full bg-white rounded-2xl shadow p-8 space-y-6">
        {/* User Header */}
        <header className="flex items-center gap-4 border-b pb-4">
          {owner?.picture ? (
            <a href={PostOwerPfP_onclick}>
              <img
                src={owner.picture}
                alt={owner.given_name || "Profile"}
                className="w-10 h-10 rounded-full object-cover"
              />
            </a>
          ) : (
            <span className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-400 shadow">
              👤
            </span>
          )}
          <div>
            <h2 className="text-lg font-semibold">
              {owner.given_name + " " + owner.family_name || "Unknown User"}
            </h2>
            <p className="text-sm text-gray-500">
              Posted on {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </header>

        {/* Post Content */}
        <section>
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <p className="text-gray-600 mb-4">{post.description}</p>

          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full rounded-xl shadow mb-6"
            />
          )}

          <article className="prose lg:prose-lg">
            <p>{post.content}</p>
          </article>
        </section>
      </main>
    </div>
  </>
);
}
