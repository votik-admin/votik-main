import ChatSessionProvider from "@app/contexts/UserContext";
import { getSessionAndUser } from "@app/lib/auth";
import { createClient } from "@app/lib/supabase/server";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import JoinChat from "./JoinChat";

export default async function Page({
  params: { slug },
}: {
  params: {
    slug: string;
  };
}) {
  const { error, session, user } = await getSessionAndUser();

  if (!session || !user || error) {
    const headersList = headers();
    const header_url = headersList.get("x-url") || "";
    const path = new URL(header_url).pathname;
    redirect(`/auth/login?redirect=${path}`);
  }

  const supabase = createClient();

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (eventError || !event) {
    return notFound();
  }

  // Check if the user has a public profile
  const { data, error: fetchError } = await supabase
    .from("users_public")
    .select("*")
    .eq("id", user.id)
    .single();

  // Check if the user is a participant in the event
  const { data: chatUser, error: chatUserError } = await supabase
    .from("participants")
    .select("*")
    .eq("user_id", user.id)
    .eq("event_id", event.id)
    .single();

  if (!chatUserError && chatUser) {
    console.error("User is already a participant:", chatUser);
    // Redirect to the chat room if the user is already a participant
    redirect(`/events/${slug}/chat`);
  }

  if (fetchError || !data) {
    redirect(`/user/account`);
  }

  return (
    <ChatSessionProvider initialSession={session} initialUser={data}>
      <JoinChat eventId={event.id} />
    </ChatSessionProvider>
  );
}
