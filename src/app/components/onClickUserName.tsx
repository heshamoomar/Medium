"use client";
import { redirect } from "next/navigation";

export default function OnClickUserName( {userAgent}: {userAgent: any}) {

  const handleDashboardRedirect = () => {
    redirect("/dashboard");
  };

  return (
    <span className="font-semibold text-gray-700 cursor-pointer" onClick={handleDashboardRedirect}>
      {userAgent.given_name || userAgent.email || "User"}
    </span>
  );
}
