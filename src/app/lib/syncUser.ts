//  syncUser.ts
// Syncs the authenticated Kinde user with our MongoDB database.
// 
// If the user does not exist in our DB, creates a new user record.
// If the user exists, updates their info (e.g., last login time).  
// Returns the user document from our DB.
// Uses Kinde's server-side session to get the authenticated user info.


import User from "../models/User";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { connectDB } from "../lib/mongodb";

export async function syncUser() {
  await connectDB();

  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  if (!kindeUser) return null;

  const {
    id: auth_id,
    email,
    family_name,
    given_name,
    picture,
  } = kindeUser;

  const user = await User.findOneAndUpdate(
    { auth_id }, // match by Kinde's ID
    {
      auth_id,
      email,
      family_name,
      given_name,
      picture,
      lastLogin: new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return user;
}
