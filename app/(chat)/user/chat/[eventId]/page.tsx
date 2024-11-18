import { Chat } from "@app/components/chat";
import ChatSessionProvider from "@app/contexts/UserContext";
import { getSessionAndUser } from "@app/lib/auth";
import { createClient } from "@app/lib/supabase/server";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function Page({
  params: { eventId },
}: {
  params: {
    eventId: string;
  };
}) {
  // Check if the user is logged in
  const { session, user, error } = await getSessionAndUser();

  if (error || !user || !session) {
    const headersList = headers();
    const header_url = headersList.get("x-url") || "";
    const path = new URL(header_url).pathname;
    redirect(`/auth/login?redirect=${path}`);
  }

  // Fetch the public user data
  const supabase = createClient();

  const { data, error: fetchError } = await supabase
    .from("users_public")
    .select("*")
    .eq("id", user.id)
    .single();

  if (fetchError || !data) {
    console.error("User not found:", fetchError);
    redirect(`/user/account`);
  }

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (eventError || !eventData) {
    console.error("Event not found:", eventError);
    return notFound();
  }

  return (
    <ChatSessionProvider initialSession={session} initialUser={data}>
      <Chat />
    </ChatSessionProvider>
  );
}
