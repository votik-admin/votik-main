import OrganizerProvider from "@app/contexts/OrganizerContext";
import { getSessionAndOrganizer } from "@app/lib/auth";
import MainPage from "@app/organizers/components/AddYourEvent/MainPage";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AddEvent() {
  const { session, organizer, error } = await getSessionAndOrganizer();

  if (!session || !organizer || error) {
    const headersList = headers();
    const header_url = headersList.get("x-url") || "";
    const path = new URL(header_url).pathname;
    redirect(`/auth/login?redirect=${path}`);
  }

  return (
    <OrganizerProvider
      initialOrganizer={organizer}
      initialSession={session}
      onLogoutBlock={true}
    >
      <MainPage />
    </OrganizerProvider>
  );
}
