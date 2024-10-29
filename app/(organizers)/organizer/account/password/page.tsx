import OrganizerProvider from "@app/contexts/OrganizerContext";
import { getSessionAndOrganizer } from "@app/lib/auth";
import AccountPass from "@app/organizers/components/AccountPage/AccountPass";
import { redirect } from "next/navigation";

export default async function Page() {
  const { session, organizer, error } = await getSessionAndOrganizer();

  if (!session || !organizer || error) {
    redirect("/organizer/auth/login");
  }

  return (
    <OrganizerProvider initialOrganizer={organizer} initialSession={session}>
      <AccountPass />
    </OrganizerProvider>
  );
}
