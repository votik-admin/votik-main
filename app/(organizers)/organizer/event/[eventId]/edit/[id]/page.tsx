import { createClient } from "@app/lib/supabase/server";
import AddEvent1 from "@app/organizers/components/AddYourEvent/PageAddListing1";
import AddEvent2 from "@app/organizers/components/AddYourEvent/PageAddListing2";
import AddEvent3 from "@app/organizers/components/AddYourEvent/PageAddListing3";
import AddEvent4 from "@app/organizers/components/AddYourEvent/PageAddListing5";
import { notFound } from "next/navigation";

export default async function AddListing({
  params: { eventId, id },
}: {
  params: {
    id: string;
    eventId: string;
  };
}) {
  const supabase = createClient();

  if (!id || Array.isArray(id)) {
    console.error("Invalid id", id);
    notFound();
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (error || !data) {
    console.error("Error fetching event", error);
    notFound();
  }

  const FormMap: { [x: string]: React.ReactNode } = {
    1: <AddEvent1 event={data} />,
    2: <AddEvent2 event={data} />,
    3: <AddEvent3 event={data} />,
    4: <AddEvent4 />,
  };

  return FormMap[id] || <AddEvent1 event={data} />;
}
