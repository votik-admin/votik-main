import { getSessionAndOrganizer } from "@app/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import DataTable from "./DataTable";
import RenderDataTable from "./components/RenderDataTable";

const HomePage = async () => {
  const { session, organizer, error } = await getSessionAndOrganizer();
  if (!session || !organizer || error) {
    redirect("/organizer/signup");
  }

  return (
    <div className="container">
      <RenderDataTable organizer={organizer} />
    </div>
  );
};

export default HomePage;
