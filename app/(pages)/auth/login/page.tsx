import PageLogin from "@app/components/PageLogin/PageLogin";
import SessionProvider from "@app/contexts/SessionContext";
import { getSessionAndUser } from "@app/lib/auth";
import { sanitizeRedirect } from "@app/utils/sanitizeRedirectUrl";
import { revalidatePath } from "next/cache";
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

  const revalidate = async () => {
    "use server";
    revalidatePath("(pages)/auth/login", "page");
  };

  return (
    <SessionProvider initialSession={session} initialUser={user}>
      <PageLogin revalidate={revalidate} />
    </SessionProvider>
  );
}
