import OrganizerProvider from "@app/contexts/OrganizerContext";
import { getSessionAndOrganizer } from "@app/lib/auth";
import { createClient } from "@app/lib/supabase/server";
import AddEvent1 from "@app/organizers/components/AddYourEvent/PageAddListing1";
import AddEvent2 from "@app/organizers/components/AddYourEvent/PageAddListing2";
import AddEvent3 from "@app/organizers/components/AddYourEvent/PageAddListing3";
import AddEvent4 from "@app/organizers/components/AddYourEvent/PageAddListing4";
import AddEvent5 from "@app/organizers/components/AddYourEvent/PageAddListing5";
import AddEvent6 from "@app/organizers/components/AddYourEvent/PageAddListing6";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

function SearchBarFallback() {
  return <>placeholder</>;
}

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

  const revalidate = async () => {
    "use server";
    revalidatePath("(organizers)/organizer/event/[eventId]/edit/[id]", "page");
  };

  const FormMap: { [x: string]: React.ReactNode } = {
    1: <AddEvent1 event={data} revalidate={revalidate} />,
    2: <AddEvent2 event={data} revalidate={revalidate} />,
    3: <AddEvent3 event={data} revalidate={revalidate} />,
    4: <AddEvent4 event={data} revalidate={revalidate} />,
    5: <AddEvent5 event={data} revalidate={revalidate} />,
    6: <AddEvent6 />,
  };

  return FormMap[id] || <AddEvent1 event={data} />;
}
