import PageLogin from "@app/components/PageLogin/PageLogin";
import SessionProvider from "@app/contexts/SessionContext";
import { getSessionAndUser } from "@app/lib/auth";
import { createClient } from "@app/lib/supabase/server";
import { Database } from "@app/types/database.types";
import { redirect } from "next/navigation";

export default async function Login() {
  const { session, user, error } = await getSessionAndUser();

  if (!error && user && session) {
    redirect("/account");
  }

  return (
    <SessionProvider initialSession={session} initialUser={user}>
      <PageLogin />
    </SessionProvider>
  );
}
