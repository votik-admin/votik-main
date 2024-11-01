import PageLogin from "@app/components/PageLogin/PageLogin";
import PageSignUp from "@app/components/PageSignUp/PageSignUp";
import SessionProvider from "@app/contexts/SessionContext";
import { getSessionAndUser } from "@app/lib/auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const { session, user, error } = await getSessionAndUser();

  if (!error && user && session) {
    redirect("/user/account");
  }

  return (
    <SessionProvider initialSession={session} initialUser={user}>
      <PageSignUp />
    </SessionProvider>
  );
}
