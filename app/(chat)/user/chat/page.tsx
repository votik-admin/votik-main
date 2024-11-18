import { Chat } from "@app/components/chat";
import ChatSessionProvider from "@app/contexts/UserContext";
import { getSessionAndUser } from "@app/lib/auth";
import { createClient } from "@app/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
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

  return (
    <ChatSessionProvider initialSession={session} initialUser={data}>
      <Chat />
    </ChatSessionProvider>
  );
}
