import ViewBooking from "@app/components/ViewBooking/ViewBooking";
import { getSessionAndUser } from "@app/lib/auth";
import { createClient } from "@app/lib/supabase/server";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function Page({
  params: { bookingId },
}: {
  params: {
    bookingId: string;
  };
}) {
  const { session, user, error: sessionError } = await getSessionAndUser();

  if (sessionError || !user) {
    const headersList = headers();
    const header_url = headersList.get("x-url") || "";
    const path = new URL(header_url).pathname;
    redirect(`/auth/login?redirect=${path}`);
  }

  const supabaseServerClient = createClient();
  const { data, error } = await supabaseServerClient
    .from("ticket_bookings")
    .select("*, tickets(*), events(*), users(*)")
    .eq("id", bookingId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return notFound();
  }

  const event = data.events;

  if (!event) {
    return notFound();
  }

  return (
    <div className="p-6">
      <ViewBooking data={data} event={event} />
    </div>
  );
}
