import AccountPass from "@app/containers/AccountPage/AccountPass";
import SessionProvider from "@app/contexts/SessionContext";
import { getSessionAndUser } from "@app/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { session, user, error } = await getSessionAndUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return (
    <SessionProvider initialSession={session} initialUser={user}>
      <AccountPass />
    </SessionProvider>
  );
}
