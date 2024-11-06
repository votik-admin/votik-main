import PageLogin from "@app/components/PageLogin/PageLogin";
import PageSignUp from "@app/components/PageSignUp/PageSignUp";
import SessionProvider from "@app/contexts/SessionContext";
import { getSessionAndUser } from "@app/lib/auth";
import { sanitizeRedirect } from "@app/utils/sanitizeRedirectUrl";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Login() {
  const { session, user, error } = await getSessionAndUser();

  if (!error && user && session) {
    const headersList = headers();
    const header_url = headersList.get("x-url") || "";
    const redirectUrl = new URL(header_url).searchParams.get("redirect") ?? "";
    if (redirectUrl) {
      redirect(sanitizeRedirect(redirectUrl));
    }
    redirect("/user/account");
  }

  return (
    <SessionProvider initialSession={session} initialUser={user}>
      <PageSignUp />
    </SessionProvider>
  );
}
