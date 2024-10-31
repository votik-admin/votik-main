import { getSessionAndOrganizer } from "@app/lib/auth";
import { createClient } from "@app/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function layout({
  children,
  params: { eventId },
}: {
  children: React.ReactNode;
  params: { eventId: string };
}) {
  const { session, organizer, error: e } = await getSessionAndOrganizer();

  const supabase = createClient();

  const { error, data } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (error || !data || data.organizer_id !== organizer!.id) {
    redirect("/organizer");
  }

  return <>{children}</>;
}
