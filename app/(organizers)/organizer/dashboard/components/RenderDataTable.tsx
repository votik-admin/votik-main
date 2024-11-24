"use client";

import Spinner from "@app/components/Spinner/Spinner";
import supabase from "@app/lib/supabase";
import { Tables } from "@app/types/database.types";
import React from "react";
import useSWR from "swr";
import DataTable from "../DataTable";

const RenderDataTable = ({
  organizer,
}: {
  organizer: Tables<"organizers">;
}) => {
  const { data, error, isLoading } = useSWR(
    "getAllEventsByOrganizer",
    async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*, tickets(*)")
        .eq("organizer_id", organizer.id);
      if (error) throw error.message;
      return data;
    }
  );

  if (isLoading) {
    return (
      <div className="flex py-24 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <div>{data && <DataTable data={data} />}</div>;
};

export default RenderDataTable;
