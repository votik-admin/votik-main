import { getSessionAndOrganizer } from "@app/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import DashboardPage from "./DashboardPage";

const HomePage = async () => {
  const { session, organizer, error } = await getSessionAndOrganizer();
  if (!session || !organizer || error) {
    redirect("/organizer/signup");
  }

  return (
    <div className="">
      <div className="container">
        <DashboardPage organizer={organizer} />
      </div>
    </div>
  );
};

export default HomePage;
