
import { syncUser } from "../lib/syncUser";
import { redirect } from "next/navigation"; 
import PostClient from "./PostClient";

export default async function PostPage() {
  const user = await syncUser();

  if (!user) {
    redirect("/"); // not logged in
  }


const plainUser = JSON.parse(JSON.stringify(user)); // to remove Mongoose document methods
// needed because PostClient is a Client Component and cannot receive Mongoose document directly
// (could also use user.toObject() if it were available)

  return <PostClient user={plainUser} />;
}
