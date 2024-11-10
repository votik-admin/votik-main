import { getSessionAndOrganizer } from "@app/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import DashboardPage from "./DashboardPage";
import { headers } from "next/headers";

const HomePage = async () => {
  const { session, organizer, error } = await getSessionAndOrganizer();

  if (!session || !organizer || error) {
    const headersList = headers();
    const header_url = headersList.get("x-url") || "";
    const path = new URL(header_url).pathname;
    if (error || !session) redirect(`/auth/login?redirect=${path}`);
    if (!organizer) redirect(`/organizer/signup?redirect=${path}`);
  }

  return (
    <div className="bg-white dark:bg-black">
      <div className="container">
        <DashboardPage organizer={organizer} />
      </div>
    </div>
  );
};

export default HomePage;
