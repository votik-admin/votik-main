import { getSessionAndOrganizer } from "@app/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import DashboardPage from "./DashboardPage";

const HomePage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const { session, organizer, error } = await getSessionAndOrganizer();
  if (!session || !organizer || error) {
    redirect("/organizer/signup");
  }

  return (
    <div className="container">
      <DashboardPage organizer={organizer} slug={slug} />
    </div>
  );
};

export default HomePage;
