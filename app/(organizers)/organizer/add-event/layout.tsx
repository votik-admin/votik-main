import { getSessionAndOrganizer } from "@app/lib/auth";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import { redirect } from "next/navigation";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, organizer, error } = await getSessionAndOrganizer();

  if (!session || !organizer || error) {
    redirect("/organizer/auth/login");
  }

  if (organizer.profile_complete === false) {
    redirect("/organizer/complete-profile");
  }

  return <>{children}</>;
}
