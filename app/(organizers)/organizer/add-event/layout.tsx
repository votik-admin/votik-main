import { getSessionAndOrganizer } from "@app/lib/auth";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, organizer, error } = await getSessionAndOrganizer();

  if (!session || !organizer || error) {
    const headersList = headers();
    const header_url = headersList.get("x-url") || "";
    const path = new URL(header_url).pathname;
    redirect(`/auth/login?redirect=${path}`);
  }

  if (organizer.profile_complete === false) {
    redirect("/organizer/complete-profile");
  }

  return <>{children}</>;
}
