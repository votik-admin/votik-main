import { createServiceClient } from "@app/lib/supabase/serverAdmin";
import ManageBouncers from "@app/organizers/components/ManageBouncers/ManageBouncers";
import { getBouncersForEvent, getEventFromId } from "@app/queries";
import { notFound } from "next/navigation";

export default async function Page({
  params: { eventId },
}: {
  params: {
    eventId: string;
  };
}) {
  const supabase = createServiceClient();

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (error || !event) {
    if (error) {
      console.log("💣💣💣", error);
    }
    return notFound();
  }

  // Get the bouncers for this event
  const { data: bouncers, error: bouncersError } = await supabase
    .from("bouncer_logins")
    .select("*")
    .eq("event_id", eventId);

  if (bouncersError) {
    console.log("💣💣💣", bouncersError);
    return notFound();
  }

  return <ManageBouncers bouncers={bouncers} event={event} />;
}
