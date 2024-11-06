import AccountPass from "@app/containers/AccountPage/AccountPass";
import SessionProvider from "@app/contexts/SessionContext";
import { getSessionAndUser } from "@app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const { session, user, error } = await getSessionAndUser();

  if (error || !user) {
    const headersList = headers();
    const header_url = headersList.get("x-url") || "";
    const path = new URL(header_url).pathname;
    redirect(`/auth/login?redirect=${path}`);
  }

  return (
    <SessionProvider initialSession={session} initialUser={user}>
      <AccountPass />
    </SessionProvider>
  );
}
