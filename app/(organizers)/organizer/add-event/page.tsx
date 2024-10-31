import OrganizerProvider from "@app/contexts/OrganizerContext";
import { getSessionAndOrganizer } from "@app/lib/auth";
import MainPage from "@app/organizers/components/AddYourEvent/MainPage";
import { redirect } from "next/navigation";

export default async function AddEvent() {
  const { session, organizer, error } = await getSessionAndOrganizer();

  if (!session || !organizer || error) {
    redirect("/organizer/auth/login");
  }

  return (
    <OrganizerProvider initialOrganizer={organizer} initialSession={session}>
      <MainPage />
    </OrganizerProvider>
  );
}
