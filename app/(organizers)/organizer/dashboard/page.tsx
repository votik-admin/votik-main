import { getSessionAndOrganizer } from "@app/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import { headers } from "next/headers";
import DashboardPageAccumulated from "./DashboardPageAccumulated";

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
    <div className="container">
      <DashboardPageAccumulated organizer={organizer} />
    </div>
  );
};

export default HomePage;
