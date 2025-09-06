import { notFound } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { syncUser } from "../../lib/syncUser";
import { redirect } from "next/navigation";

export default async function Page({ params }: Awaited<{ params: { id: string } }>) {
  const { id } = await params;


  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}`, {
      method: "GET",
      //cache: "no-store", // ensures fresh data
      headers: {
        "Content-Type": "application/json",
      },
      //next: { revalidate: 10 }, // revalidate every 10 seconds


    });


  if (!res.ok) {
    console.log("Post not found with ID:", id );
    console.error("Failed to fetch post:", res.statusText);

    return notFound();
  }
  
  const post = await res.json();

  console.log("Fetched post:", post);


  return (
    <main className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-6">{post.description}</p>


      {post.image ? (
        <img
          src={post.image}
          alt={post.title}
          width="400"
          height="400"
          //crop={{ type: "auto", source: true }}
          className="w-full h-auto rounded-xl mb-6"
        />
      ) : (
        //<div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-xl mb-6">
        //  <span className="text-gray-500">No image available</span>
        //</div>
        <></>
      )}

      <article className="prose lg:prose-lg">
        <p>{post.content}</p>
      </article>

      <div className="mt-8 text-sm text-gray-500">
        Posted on {new Date(post.createdAt).toLocaleDateString()}
      </div>
    </main>
  );
}
