import ChatBox from "@app/components/Chat/ChatRoom";
import ChatSessionProvider from "@app/contexts/UserContext";
import { getSessionAndUser } from "@app/lib/auth";
import { createClient } from "@app/lib/supabase/server";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function ChatRoom({
  params: { slug },
}: {
  params: {
    slug: string;
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

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (eventError || !event) {
    console.error("Event not found:", eventError);
    return notFound();
  }

  const { data, error: fetchError } = await supabase
    .from("users_public")
    .select("*")
    .eq("id", user.id)
    .single();

  if (fetchError || !data) {
    console.error("User not found:", fetchError);
    redirect(`/user/account`);
  }

  // Check if the user is a participant in the event
  const { data: chatUser, error: chatUserError } = await supabase
    .from("participants")
    .select("*")
    .eq("user_id", user.id)
    .eq("event_id", event.id);

  // Ask the user to join the event if they are not a participant
  if (chatUserError || !chatUser) {
    console.error("User is not a participant:", chatUserError);
    redirect(`/events/${slug}/join-chat`);
  }

  return (
    <ChatSessionProvider initialSession={session} initialUser={data}>
      <ChatBox event={event} />
    </ChatSessionProvider>
  );
}
