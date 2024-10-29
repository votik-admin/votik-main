import OrganizerProvider from "@app/contexts/OrganizerContext";
import { getSessionAndOrganizer } from "@app/lib/auth";
import AccountPage from "@app/organizers/components/AccountPage/AccountPage";
import { redirect } from "next/navigation";

export default async function Page() {
  const { session, organizer, error } = await getSessionAndOrganizer();

  if (!session || !organizer || error) {
    redirect("/organizer/auth/login");
  }

  return (
    <OrganizerProvider initialOrganizer={organizer} initialSession={session}>
      <AccountPage />
    </OrganizerProvider>
  );
}
