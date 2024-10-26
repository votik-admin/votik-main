import AccountPage from "@app/containers/AccountPage/AccountPage";
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
      <AccountPage />
    </SessionProvider>
  );
}
