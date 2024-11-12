import AccountPage from "@app/containers/AccountPage/AccountPage";
import SessionProvider from "@app/contexts/SessionContext";
import { getSessionAndUser } from "@app/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const { session, user, error } = await getSessionAndUser();

  console.log({ session, user, error });

  if (error || !user) {
    const headersList = headers();
    const header_url = headersList.get("x-url") || "";
    const path = new URL(header_url).pathname;
    redirect(`/auth/login?redirect=${path}`);
  }

  const revalidate = async () => {
    "use server";
    revalidatePath("(pages)/user/account", "page");
  };

  return (
    <SessionProvider
      initialSession={session}
      initialUser={user}
      // onLogoutBlock={true}
    >
      <AccountPage revalidate={revalidate} />
    </SessionProvider>
  );
}
